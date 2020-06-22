import axios from "axios";
import cheerio from "cheerio";
import { format, isAfter, parse } from "date-fns";
import { parseFromTimeZone } from "date-fns-timezone";
import { batchWrite, client, tableName } from "./db";
import { LocationEntity } from "./location";
import { celciusToFahrenheit } from "./weather";

export async function loadAndSave(siteTag: string) {
  const data = await scrapeData(siteTag);
  await saveToDynamo(siteTag, data);
}

export async function getData(
  location: LocationEntity,
  start: Date,
  end: Date
): Promise<WindFinderParsed[]> {
  const pk = `windfinder-forecast-${location.windfinder.slug}`;
  const result = await client
    .query({
      TableName: tableName,
      KeyConditionExpression: "pk = :key AND sk BETWEEN :start AND :end",
      ExpressionAttributeValues: {
        ":key": pk,
        ":start": start.getTime(),
        ":end": end.getTime(),
      },
    })
    .promise();

  if (!result.Items) return [];

  return result.Items.map((item) => ({
    timestamp: new Date(item.sk),
    ...item.data,
  }));
}

async function scrapeData(siteTag: string): Promise<WindFinderParsed[]> {
  // fetch the forecast (10 days) and superforecast (3 days)
  let [superForecast, forecast] = await Promise.all([
    normalize(await fetchSuperForecast(siteTag)),
    normalize(await fetchForecast(siteTag)),
  ]);

  // rain in superforecast is mm/hr
  // rain in regular forecast is mm/3hr
  forecast = forecast.map((x) => ({
    ...x,
    rainMmPerHour: Number((x.rainMmPerHour / 3).toFixed(2)),
  }));

  // figure out the latest date of superforecast and exclude forecast points before that
  const lastSuperForecastDate = new Date(
    superForecast[superForecast.length - 1].timestamp
  );
  const limitedForecast = forecast.filter((x) => {
    return isAfter(new Date(x.timestamp), lastSuperForecastDate);
  });

  // combine them
  return [...superForecast, ...limitedForecast];
}

async function fetchSuperForecast(siteTag: string) {
  const url = `https://www.windfinder.com/weatherforecast/${siteTag}`;
  return fetchAndParse(url);
}

async function fetchForecast(siteTag: string) {
  const url = `https://www.windfinder.com/forecast/${siteTag}`;
  return fetchAndParse(url);
}

interface WindFinderResult {
  date: string;
  timePeriods: WindFinderTimePeriod[];
}

interface WindFinderTimePeriod {
  localHour: number;
  wind: {
    direction: number;
    speed: number;
    speedUnit: string;
    gustSpeed: number;
    gustSpeedUnit: string;
  };
  wave: {
    direction?: number;
    height?: number;
    heightUnit?: string;
  };
  cloudCoverPercent: number;
  temperatureCelcius: number;
  rainMmPerPeriod: number;
}

interface WindFinderParsed {
  timestamp: Date;
  wind: {
    direction: number;
    speedMph: number;
    gustMph: number;
  };
  wave: {
    direction?: number;
    heightFt?: number;
  };
  cloudCoverPercent: number;
  temperature: number;
  rainMmPerHour: number;
}

async function fetchAndParse(url: string): Promise<WindFinderResult[]> {
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36",
    },
  });

  const $ = cheerio.load(data);

  const parsed = $(".forecast-day")
    .map((i, dayEl) => {
      return {
        date: $(".weathertable__header h4", dayEl).text().trim(),
        timePeriods: $(".weathertable__row", dayEl)
          .map((j, timeEl) => {
            function extract(selector: string) {
              return $(selector, timeEl).text().trim();
            }

            const waveDirection = extract(
              ".cell-waves-1 .data-direction-unit"
            ).replace("°", "");
            const waveHeight = extract(
              ".cell-waves-2 .data-waveheight .units-wh"
            );

            return {
              localHour: Number(
                extract(".cell-timespan .value").replace("h", "")
              ),
              wind: {
                direction: parseInt(
                  extract(
                    ".cell-wind-2 .data-direction-unit.units-wd-deg"
                  ).replace("°", "")
                ),
                speed: Number(extract(".cell-wind-3 .speed .units-ws")),
                speedUnit: extract(".cell-wind-3 .speed .units-desc-ws"),
                gustSpeed: Number(
                  extract(".cell-wind-3 .data-gusts .units-ws")
                ),
                gustSpeedUnit: extract(
                  ".cell-wind-3 .data-gusts .units-desc-ws"
                ),
              },
              wave: {
                direction: waveDirection ? parseInt(waveDirection) : undefined,
                height: waveHeight ? Number(waveHeight) : undefined,
                heightUnit:
                  extract(".cell-waves-2 .data-waveheight .data-unit") ||
                  undefined,
              },
              cloudCoverPercent: Number(
                extract(".cell-weather-1 .data-cover__number").replace("%", "")
              ),
              temperatureCelcius: Number(
                extract(".cell-weather-2 .data-temp .units-at")
              ),
              rainMmPerPeriod: Number(
                extract(".cell-weather-1 .data-rain .units-pr")
              ),
            };
          })
          .get(),
      };
    })
    .get();

  if (parsed.length === 0) {
    throw new Error(`Unable to parse windfinder data for ${url}`);
  }

  return parsed;
}

function normalize(days: WindFinderResult[]): WindFinderParsed[] {
  return days.flatMap((day) => {
    const datePart = format(
      parse(day.date, "EEEE, LLLL d", new Date()),
      "yyyy-MM-dd"
    );

    return day.timePeriods.map((timePeriod) => {
      const timePart = String(timePeriod.localHour).padStart(2, "0") + ":00:00";
      const utcTime = parseFromTimeZone(`${datePart} ${timePart}`, {
        timeZone: "US/Central",
      });

      return {
        timestamp: utcTime,
        wind: {
          direction: timePeriod.wind.direction,
          speedMph: knotsToMph(timePeriod.wind.speed),
          gustMph: knotsToMph(timePeriod.wind.gustSpeed),
        },
        wave: {
          direction: timePeriod.wave.direction,
          heightFt:
            timePeriod.wave.height && meterToFeet(timePeriod.wave.height),
        },
        cloudCoverPercent: timePeriod.cloudCoverPercent,
        temperature: parseInt(
          celciusToFahrenheit(timePeriod.temperatureCelcius),
          10
        ),
        rainMmPerHour: timePeriod.rainMmPerPeriod,
      };
    });
  });
}

export function knotsToMph(knots: number): number {
  return Number((knots * 1.15078).toFixed(1));
}

function meterToFeet(meters: number): number {
  return Number((meters * 3.28084).toFixed(1));
}

async function saveToDynamo(slug: string, windFinderData: WindFinderParsed[]) {
  const queries = windFinderData.map((data) => {
    const { timestamp, ...itemData } = data;
    const itemDate = timestamp;
    return {
      PutRequest: {
        Item: {
          pk: `windfinder-forecast-${slug}`,
          sk: itemDate.getTime(),
          updatedAt: new Date().toISOString(),
          data: itemData,
        },
      },
    };
  });

  await batchWrite(queries);
}

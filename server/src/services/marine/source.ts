import { DocumentClient } from "aws-sdk/clients/dynamodb";
import axios from "axios";
import axiosRetry from "axios-retry";
import cheerio from "cheerio";
import { addDays, format, startOfDay } from "date-fns";
import { parseFromTimeZone } from "date-fns-timezone";
import { put } from "../db";
import { parseWindDirection } from "../utils";
type PutItemInputAttributeMap = DocumentClient.PutItemInputAttributeMap;

axiosRetry(axios, { retries: 3, retryDelay: (retryCount) => retryCount * 500 });

export interface MarineForecast {
  timePeriod: {
    text: string;
    date: string;
    isDaytime: boolean;
  };
  forecast: {
    text: string;
    waterCondition?: string;
    windDirection?: { text: string; degrees: number };
    windSpeed?: { from: number; to: number };
  };
}

export const storeMarineForecast = async (marineZoneId: string) => {
  const data = await fetchForecast(marineZoneId);
  await saveMarineForecastToDynamo(marineZoneId, data);
};

async function saveMarineForecastToDynamo(
  marineZoneId: string,
  data: MarineForecast[]
) {
  const item = buildMarineForecastQuery(marineZoneId, data);
  await put(item);
}

function buildMarineForecastQuery(
  marineZoneId: string,
  data: MarineForecast[]
): PutItemInputAttributeMap {
  return {
    Item: {
      pk: `marine-forecast-${marineZoneId}`,
      sk: new Date().getTime(),
      updatedAt: new Date().toISOString(),
      data,
      ttl: addDays(new Date(), 30).getTime(),
    },
  };
}

const fetchForecast = async (
  marineZoneId: string
): Promise<MarineForecast[]> => {
  try {
    const url = `https://marine.weather.gov/MapClick.php?zoneid=${marineZoneId}&zflg=1`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    return $(".row-forecast", "#detailed-forecast-body")
      .map((i, el) => {
        return {
          timePeriod: parseTimePeriod($(".forecast-label", el).text().trim()),
          forecast: {
            ...parseForecast($(".forecast-text", el).text().trim()),
          },
        };
      })
      .get();
  } catch (e) {
    console.error(e);
    return [];
  }
};

export function parseForecast(
  forecastText: string
): MarineForecast["forecast"] {
  let retVal: any = { text: forecastText };
  retVal.waterCondition = parseWaterCondition(forecastText);

  const windRegex = /(?<direction>[\w]+) winds(?<qualifier> around| up to| near| rising to| building to)? ((?<speed>[\d]+)|((?<speedStart>[\d]+) to (?<speedEnd>[\d]+))) knots( becoming)?/im;
  const hurricaneRegex = /hurricane/im;
  const tropicalStormRegex = /tropical storm/im;
  let matches = forecastText.match(windRegex);
  let hurricaneMatches = forecastText.match(hurricaneRegex);
  let tropicalStormMatches = forecastText.match(tropicalStormRegex);

  if (matches && matches.groups) {
    retVal.windDirection = parseWindDirection(matches.groups.direction);
    retVal.windSpeed = matches.groups.speed
      ? {
          from:
            matches.groups.qualifier &&
            (matches.groups.qualifier.trim() === "up to" ||
              matches.groups.qualifier.trim() === "rising to" ||
              matches.groups.qualifier.trim() === "building to")
              ? 0
              : Number(matches.groups.speed),
          to: Number(matches.groups.speed),
        }
      : {
          from: Number(matches.groups.speedStart),
          to: Number(matches.groups.speedEnd),
        };
  } else if (hurricaneMatches) {
    retVal.windSpeed = { from: 64, to: 64 };
  } else if (tropicalStormMatches) {
    retVal.windSpeed = { from: 34, to: 63 };
  } else {
    console.error({
      message: "Unable to parse wind speed/direction from marine forecast",
      forecastText,
    });
  }
  return retVal;
}

function parseWaterCondition(forecastText: string): string | void {
  const inshoreRegex = /(Bay|Lake|Nearshore) waters a? ?(?<data>.*?)(\.| decreasing| increasing)/im;
  const offshoreRegex = /(seas|waves) (?<qualifier>(around)|(less than)|(building to) )?(?<numbers>.*?)(\.|(?<postQualifier>( or less)|( with occasional.*?))\.)/im;
  const stormRegex = /(tropical storm)|(hurricane)/im;
  const inshoreMatches = forecastText.match(inshoreRegex);
  const offshoreMatches = forecastText.match(offshoreRegex);
  const stormMatches = forecastText.match(stormRegex);
  if (inshoreMatches && inshoreMatches.groups) {
    return inshoreMatches.groups.data;
  } else if (offshoreMatches && offshoreMatches.groups) {
    const g = offshoreMatches.groups;

    const [from, to] = g.numbers
      .replace(/foot|feet/im, "")
      .trim()
      .split(" to ");

    if (g.qualifier && g.qualifier.trim() === "around") {
      return `${from}-${from}`;
    } else if (g.qualifier && g.qualifier.trim() === "less than") {
      return `0-${from}`;
    } else if (g.postQualifier && g.postQualifier.trim() === "or less") {
      return `0-${from}`;
    } else {
      return `${from}-${to}`;
    }
  } else if (stormMatches) {
    return "rough";
  } else {
    console.error({ message: "Unable to parse water condition", forecastText });
  }
}

function parseTimePeriod(timePeriod: string) {
  let today = startOfDay(new Date());
  today = parseFromTimeZone(today.toISOString(), {
    timeZone: "US/Central",
  });
  if (timePeriod.match(/(rest of )?today/im)) {
    return {
      text: timePeriod,
      date: today.toISOString(),
      isDaytime: true,
    };
  } else if (timePeriod.match(/(rest of )?tonight/im)) {
    return {
      text: timePeriod,
      date: today.toISOString(),
      isDaytime: false,
    };
  } else {
    const matches = timePeriod.match(
      /(?<dayName>[a-z]+)(?<isNight> night$)?/im
    );
    if (matches) {
      const dayName = matches.groups!.dayName;
      const isDaytime = !matches.groups!.isNight;
      // try to figure out what date this dayName aligns with
      for (let i = 1; i <= 7; i++) {
        const attempt = addDays(today, i);
        if (dayName.toLowerCase() === format(attempt, "eeee").toLowerCase()) {
          return {
            text: timePeriod,
            date: attempt.toISOString(),
            isDaytime: isDaytime,
          };
        }
      }
    }
  }

  // couldn't match it up with a day
  throw new Error(`Unable to match ${timePeriod} to a date`);
}
// calcasieu lake: https://forecast.weather.gov/shmrn.php?mz=gmz432
// sabine lake: https://forecast.weather.gov/shmrn.php?mz=gmz430
// vermillion bay: https://forecast.weather.gov/shmrn.php?mz=gmz435
// cocodrie: gmz550

// base page: https://www.weather.gov/lch/marine

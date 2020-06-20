import { LocationEntity, makeCacheKey } from "./location";
import { getForecast as getMarineForecast } from "./marine";
import { getForecast as getWeatherForecast } from "./weather";
import { CombinedForecastV2 } from "../generated/graphql";
import { getCacheVal, setCacheVal } from "./db";
import { getData } from "./wind-finder";
import {
  addDays,
  format,
  isBefore,
  isAfter,
  isEqual,
  differenceInDays,
  subSeconds,
} from "date-fns";
import { degreesToCompass } from "./usgs/source";
import { notUndefined } from "./utils";

/**
 * Combined forecast using windfinder data
 */
export const getCombinedForecastV2 = async (
  location: LocationEntity,
  start: Date,
  end: Date
): Promise<CombinedForecastV2[]> => {
  // todo add caching

  const [windFinderData, weather, marine] = await Promise.all([
    getData(location, start, end),
    getWeatherForecast(location),
    getMarineForecast(location),
  ]);

  const dayDiffs = [...Array(differenceInDays(end, start)).keys()];
  const data = dayDiffs.map((dayDiff) => {
    const startDate = addDays(start, dayDiff);
    const endDate = subSeconds(addDays(start, dayDiff + 1), 1);

    const dayName = format(startDate, "EEEE");
    let name = dayName;
    if (dayDiff === 0) {
      name = "Today";
    } else if (dayDiff >= 7) {
      name = `Next ${dayName}`;
    }

    const matchedWindFinderData = windFinderData.filter(
      (data) =>
        (isEqual(new Date(data.timestamp), startDate) ||
          isAfter(data.timestamp, startDate)) &&
        isBefore(data.timestamp, endDate)
    );
    const matchedWeatherData = weather.filter(
      (data) =>
        (isEqual(new Date(data.startTime), startDate) ||
          isAfter(new Date(data.startTime), startDate)) &&
        isBefore(new Date(data.startTime), endDate)
    );

    const matchedMarineData = marine.filter(
      (data) =>
        (isEqual(new Date(data.timePeriod.date), startDate) ||
          isAfter(new Date(data.timePeriod.date), startDate)) &&
        isBefore(new Date(data.timePeriod.date), endDate)
    );

    const weatherDay = matchedWeatherData.find((x) => x.isDaytime);
    const weatherNight = matchedWeatherData.find((x) => !x.isDaytime);
    const marineDay = matchedMarineData.find((x) => x.timePeriod.isDaytime);
    const marineNight = matchedMarineData.find((x) => !x.timePeriod.isDaytime);

    return {
      date: startDate.toISOString(),
      name,
      day: {
        short: weatherDay && weatherDay.shortForecast,
        detailed: weatherDay && weatherDay.detailedForecast,
        marine: marineDay && marineDay.forecast.text,
      },
      night: {
        short: weatherNight && weatherNight.shortForecast,
        detailed: weatherNight && weatherNight.detailedForecast,
        marine: marineNight && marineNight.forecast.text,
      },
      rain: matchedWindFinderData.map((x) => ({
        timestamp: new Date(x.timestamp).toISOString(),
        mmPerHour: x.rainMmPerHour,
      })),
      wind: matchedWindFinderData.map((x) => ({
        timestamp: new Date(x.timestamp).toISOString(),
        base: x.wind.speedMph,
        gusts: x.wind.gustMph,
        direction: {
          text: degreesToCompass(x.wind.direction),
          degrees: x.wind.direction,
        },
      })),
      waves: matchedWindFinderData
        .filter(
          (x) => notUndefined(x.wave.heightFt) && notUndefined(x.wave.direction)
        )
        .map((x) => {
          return {
            timestamp: new Date(x.timestamp).toISOString(),
            height: x.wave.heightFt,
            direction: {
              text: x.wave.direction && degreesToCompass(x.wave.direction),
              degrees: x.wave.direction,
            },
          };
        }) as CombinedForecastV2["waves"],
      temperature: matchedWindFinderData.map((x) => ({
        timestamp: new Date(x.timestamp).toISOString(),
        temperature: {
          degrees: x.temperature,
          unit: "F",
        },
      })),
    };
  });

  return data;
};

// these should be considered the same time period and normalized to the first entry
const timePeriodMappers = [
  ["today", "this afternoon", "rest of today"],
  ["tonight", "overnight", "rest of tonight"],
  ["monday", "labor day", "memorial day"],
];

/**
 * @deprecated
 */
const getNormalizedName = (name: string) => {
  let normalized = name.toLowerCase();

  const matched = timePeriodMappers.find((names) => names.includes(normalized));

  return matched ? matched[0] : normalized;
};

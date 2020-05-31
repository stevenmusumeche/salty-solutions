import { LocationEntity, makeCacheKey } from "./location";
import { getForecast as getMarineForecast, MarineForecast } from "./marine";
import { getForecast as getWeatherForecast } from "./weather";
import { CombinedForecast, CombinedForecastV2 } from "../generated/graphql";
import { getCacheVal, setCacheVal } from "./db";
import { getData } from "./wind-finder";
import {
  startOfDay,
  endOfDay,
  addDays,
  format,
  isBefore,
  isAfter,
} from "date-fns";
import { degreesToCompass } from "./usgs";
import { notUndefined } from "./utils";

/**
 * Combined forecast using windfinder data
 */
export const getCombinedForecastV2 = async (
  location: LocationEntity
): Promise<CombinedForecastV2[]> => {
  // todo add caching

  const dayDiffs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [windFinderData, weather] = await Promise.all([
    getData(
      location,
      startOfDay(new Date()),
      endOfDay(addDays(new Date(), 10))
    ),
    getWeatherForecast(location),
  ]);

  const data = dayDiffs.map((dayDiff) => {
    const startDate = startOfDay(addDays(new Date(), dayDiff));
    const endDate = endOfDay(addDays(new Date(), dayDiff));

    const dayName = format(startDate, "EEEE");
    let name = dayName;
    if (dayDiff === 0) {
      name = "Today";
    } else if (dayDiff >= 7) {
      name = `Next ${dayName}`;
    }

    const matchedWindFinderData = windFinderData.filter(
      (data) =>
        isAfter(data.timestamp, startDate) && isBefore(data.timestamp, endDate)
    );
    const matchedWeatherData = weather.filter(
      (data) =>
        isAfter(new Date(data.startTime), startDate) &&
        isBefore(new Date(data.startTime), endDate)
    );
    const weatherDay = matchedWeatherData.find((x) => x.isDaytime);
    const weatherNight = matchedWeatherData.find((x) => !x.isDaytime);

    return {
      date: startDate.toISOString(),
      name,
      day: {
        short: weatherDay && weatherDay.shortForecast,
        detailed: weatherDay && weatherDay.detailedForecast,
      },
      night: {
        short: weatherNight && weatherNight.shortForecast,
        detailed: weatherNight && weatherNight.detailedForecast,
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
          degrees: 42,
          unit: "",
        },
      })),
    };
  });

  return data;
};

/**
 * @deprecated
 */
export const getCombinedForecast = async (
  location: LocationEntity
): Promise<CombinedForecast[]> => {
  const cacheKey = makeCacheKey(location, "combined-forecast");
  const cachedData = await getCacheVal<CombinedForecast[]>(cacheKey, 3 * 60); // fresh for 3 hours
  if (cachedData) return cachedData;

  const [marine, weather] = await Promise.all([
    getMarineForecast(location),
    getWeatherForecast(location),
  ]);

  const result = weather.map((w) => {
    const timePeriod = getNormalizedName(w.name);
    const matchedMarine = marine.find(
      (x) => getNormalizedName(x.timePeriod) === timePeriod
    );

    const windSpeed =
      matchedMarine && matchedMarine.forecast.windSpeed
        ? matchedMarine.forecast.windSpeed
        : w.windSpeed;

    const windDirection =
      matchedMarine && matchedMarine.forecast.windDirection
        ? matchedMarine.forecast.windDirection
        : w.windDirection;

    return {
      timePeriod,
      wind: {
        speed: windSpeed,
        direction: windDirection,
      },
      waterCondition:
        matchedMarine && matchedMarine.forecast.waterCondition
          ? {
              text: matchedMarine.forecast.waterCondition,
              icon: "todo.jpg",
            }
          : null,
      temperature: w.temperature,
      marine: matchedMarine && matchedMarine.forecast.text,
      short: w.shortForecast,
      detailed: w.detailedForecast,
      chanceOfPrecipitation: w.chanceOfPrecipitation,
      icon: w.icon,
    };
  });

  return setCacheVal(cacheKey, result);
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

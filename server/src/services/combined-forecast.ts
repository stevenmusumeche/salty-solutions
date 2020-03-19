import { LocationEntity, makeCacheKey } from "./location";
import { getForecast as getMarineForecast, MarineForecast } from "./marine";
import { getForecast as getWeatherForecast } from "./weather";
import { CombinedForecast } from "../generated/graphql";
import { getCacheVal, setCacheVal } from "./db";

export const getCombinedForecast = async (
  location: LocationEntity
): Promise<CombinedForecast[]> => {
  const cacheKey = makeCacheKey(location, "combined-forecast");
  const cachedData = await getCacheVal<CombinedForecast[]>(cacheKey, 3 * 60); // fresh for 3 hours
  if (cachedData) return cachedData;

  const [marine, weather] = await Promise.all([
    getMarineForecast(location),
    getWeatherForecast(location)
  ]);

  const result = weather.map(w => {
    const timePeriod = getNormalizedName(w.name);
    const matchedMarine = marine.find(
      x => getNormalizedName(x.timePeriod) === timePeriod
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
        direction: windDirection
      },
      waterCondition:
        matchedMarine && matchedMarine.forecast.waterCondition
          ? {
              text: matchedMarine.forecast.waterCondition,
              icon: "todo.jpg"
            }
          : null,
      temperature: w.temperature,
      marine: matchedMarine && matchedMarine.forecast.text,
      short: w.shortForecast,
      detailed: w.detailedForecast,
      chanceOfPrecipitation: w.chanceOfPrecipitation,
      icon: w.icon
    };
  });

  return setCacheVal(cacheKey, result);
};

// these should be considered the same time period and normalized to the first entry
const timePeriodMappers = [
  ["today", "this afternoon", "rest of today"],
  ["tonight", "overnight", "rest of tonight"],
  ["monday", "labor day"]
];

const getNormalizedName = (name: string) => {
  let normalized = name.toLowerCase();

  const matched = timePeriodMappers.find(names => names.includes(normalized));

  return matched ? matched[0] : normalized;
};

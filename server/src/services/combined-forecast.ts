import { LocationEntity } from "./location";
import { getForecast as getMarineForecast, MarineForecast } from "./marine";
import { getForecast as getWeatherForecast } from "./weather";
import { WeatherForecast, CombinedForecast } from "../generated/graphql";

export const getCombinedForecast = async (
  location: LocationEntity
): Promise<CombinedForecast[]> => {
  const [marine, weather] = await Promise.all([
    getMarineForecast(location),
    getWeatherForecast(location)
  ]);

  return weather.map(w => {
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
};

// these should be considered the same time period and normalized to the first entry
const timePeriodMappers = [
  ["today", "this afternoon"],
  ["tonight", "overnight"]
];

const getNormalizedName = (name: string) => {
  let normalized = name.toLowerCase();

  const matched = timePeriodMappers.find(names => names.includes(normalized));

  return matched ? matched[0] : normalized;
};

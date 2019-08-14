import { LocationEntity } from "./location";
import { getForecast as getMarineForecast, MarineForecast } from "./marine";
import { getForecast as getWeatherForecast, WeatherForecast } from "./weather";

interface GroupedForecast {
  timePeriod: string;
  weather?: WeatherForecast;
  marine?: MarineForecast["forecast"];
}
export const getForecast = async (
  location: LocationEntity
): Promise<GroupedForecast[]> => {
  const [marine, weather] = await Promise.all([
    getMarineForecast(location),
    getWeatherForecast(location)
  ]);

  const uniqueTimePeriods = Array.from(
    new Set([
      ...marine.map(x => x.timePeriod.toLowerCase()),
      ...weather.map(x => x.name.toLowerCase())
    ])
  );

  const grouped = uniqueTimePeriods.map(timePeriod => {
    const matchedWeather = weather.find(
      x => x.name.toLowerCase() === timePeriod
    );

    const matchedMarine = marine.find(
      x => x.timePeriod.toLowerCase() === timePeriod
    );

    return {
      timePeriod: matchedWeather ? matchedWeather.name : timePeriod,
      weather: matchedWeather,
      marine: matchedMarine && matchedMarine.forecast
    };
  });

  return grouped;
};

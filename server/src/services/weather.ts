import axios from "axios";
import { LocationEntity } from "./location";

interface WeatherForecast {
  startTime: string;
  endTime: string;
  temperature: number;
  temperatureUnit: "F" | "C";
  isDaytime: boolean;
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

export const getForecast = async (location: LocationEntity): Promise<WeatherForecast[]> => {
  const url = `${location.weatherApiBase}/forecast`;
  const { data } = await axios.get(url);
  return data.properties.periods;
};

export const getHourlyForecast = async (location: LocationEntity): Promise<WeatherForecast[]> => {
  const url = `${location.weatherApiBase}/forecast/hourly`;
  const { data } = await axios.get(url);
  return data.properties.periods;
};

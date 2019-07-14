import axios from "axios";
import { LocationEntity } from "./location";
import { format, subHours } from "date-fns";
import { orderBy } from "lodash";

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

export const getForecast = async (
  location: LocationEntity
): Promise<WeatherForecast[]> => {
  const url = `${location.weatherGov.apiBase}/forecast`;
  const { data } = await axios.get(url);

  return data.properties.periods;
};

export const getHourlyForecast = async (
  location: LocationEntity
): Promise<WeatherForecast[]> => {
  const url = `${location.weatherGov.apiBase}/forecast/hourly`;
  const { data } = await axios.get(url);
  return data.properties.periods;
};

export const getCurrentConditions = async (location: LocationEntity) => {
  const url = `https://api.weather.gov/stations/${
    location.weatherGov.stationId
  }/observations/latest?require_qc=false`;

  const { data } = await axios.get<NWSLatestObservations>(url);

  return {
    temperature: celciusToFahrenheit(data.properties.temperature.value)
  };
};

export const getConditions = async (
  location: LocationEntity,
  numHours: number
) => {
  const start = format(
    subHours(new Date(), numHours),
    "yyyy-MM-dd'T'HH:mm:ssXXX"
  );
  const end = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX");

  const url = `https://api.weather.gov/stations/${
    location.weatherGov.stationId
  }/observations?end=${end}&start=${start}`;

  const { data } = await axios.get<any>(url);

  let temperature = data.features.map((x: any) => ({
    timestamp: x.properties.timestamp,
    temperature: celciusToFahrenheit(x.properties.temperature.value)
  }));
  temperature = orderBy(temperature, ["timestamp"], ["asc"]);

  return { temperature };
};

interface NWSLatestObservations {
  properties: {
    temperature: NWSValue;
    windDirection: NWSValue;
    windSpeed: NWSValue;
    visibility: NWSValue;
    maxTemperatureLast24Hours: NWSValue;
    minTemperatureLast24Hours: NWSValue;
    precipitationLastHour: NWSValue;
    precipitationLast3Hours: NWSValue;
    precipitationLast6Hours: NWSValue;
    relativeHumidity: NWSValue;
    windChill: NWSValue;
    heatIndex: NWSValue;
  };
}

interface NWSValue {
  value: number;
  unitCode: string;
  qualityControl: string;
}

function celciusToFahrenheit(celcius: number) {
  return (celcius * 1.8 + 32).toFixed(1);
}

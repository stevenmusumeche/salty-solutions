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

export const getForecast = async (
  location: LocationEntity
): Promise<WeatherForecast[]> => {
  const url = `${location.weatherApiBase}/forecast`;
  const { data } = await axios.get(url);
  return data.properties.periods;
};

export const getHourlyForecast = async (
  location: LocationEntity
): Promise<WeatherForecast[]> => {
  const url = `${location.weatherApiBase}/forecast/hourly`;
  const { data } = await axios.get(url);
  return data.properties.periods;
};

// todo: dataloader
export const getCurrentConditions = async (location: LocationEntity) => {
  const url = `https://api.weather.gov/stations/${
    location.weatherApiStationId
  }/observations/latest?require_qc=false`;

  const { data } = await axios.get<NWSLatestObservations>(url);

  return {
    temperature: celciusToFahrenheit(data.properties.temperature.value)
  };
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
  return celcius * 1.8 + 32;
}

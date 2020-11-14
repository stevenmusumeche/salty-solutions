import { WindCondition } from "./source";
import { queryTimeSeriesData, getCacheVal } from "../db";
import {
  TemperatureDetail,
  WeatherForecast,
  Maybe,
} from "../../generated/graphql";
import { orderBy } from "lodash";
import { subHours, addDays } from "date-fns";

export async function getWind(
  locationId: string,
  start: Date,
  end: Date
): Promise<WindCondition[]> {
  const pk = `weather-condition-wind-${locationId}`;
  return queryTimeSeriesData<WindCondition>(pk, start, end);
}

export const getWindLatest = async (locationId: string) => {
  const data = await getWind(locationId, subHours(new Date(), 24), new Date());

  if (data.length < 1) return null;

  return orderBy(data, [(x) => x.timestamp], ["desc"])[0];
};

export async function getTemperature(
  locationId: string,
  start: Date,
  end: Date
): Promise<TemperatureDetail[]> {
  const pk = `weather-condition-temperature-${locationId}`;
  const result = await queryTimeSeriesData<any>(pk, start, end);
  return result
    .filter((x) => x.degrees !== 32) // ignore false reading of 32 degrees F
    .map((x) => ({
      ...x,
      temperature: {
        degrees: x.degrees,
        unit: x.unit,
      },
    }));
}

export const getTemperatureLatest = async (locationId: string) => {
  const data = await getTemperature(
    locationId,
    subHours(new Date(), 24),
    new Date()
  );

  if (data.length < 1) return null;

  return orderBy(data, [(x) => x.timestamp], ["desc"])[0];
};

export function celciusToFahrenheit(celcius: number) {
  return (celcius * 1.8 + 32).toFixed(1);
}

export const getForecast = async (
  locationId: string
): Promise<WeatherForecast[]> => {
  const data = await getCacheVal<WeatherForecast[]>(
    `weather-forecast-${locationId}`,
    60 * 24
  );

  if (!data) {
    throw new Error(`Unable to get forecast for ${locationId} from dynamodb`);
  }

  return data;
};

export const getHourlyForecast = async (
  locationId: string
): Promise<WeatherForecast[]> => {
  const data = await queryTimeSeriesData<WeatherForecast>(
    `weather-forecast-hourly-${locationId}`,
    new Date(),
    addDays(new Date(), 6)
  );

  if (!data) {
    throw new Error(
      `Unable to get hourly forecast for ${locationId} from dynamodb`
    );
  }

  return data;
};

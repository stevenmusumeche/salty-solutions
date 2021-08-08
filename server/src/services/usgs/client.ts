import { queryTimeSeriesData } from "../db";
import {
  WaterHeight,
  Salinity,
  WaterTemperature,
  Wind,
  UsgsSiteEntity,
  usgsSites,
  usgsDynamoKeys,
  UsgsParams,
} from "./source";
import { subHours } from "date-fns";
import { orderBy } from "lodash";

export const getSiteById = (id: string): UsgsSiteEntity | undefined => {
  return usgsSites.find((site) => site.id === id);
};

export const getSites = () => usgsSites;

export const getWind = async (
  siteId: string,
  start: Date,
  end: Date
): Promise<Wind[]> => {
  const pk = usgsDynamoKeys[UsgsParams.WindDirection](siteId);
  return queryTimeSeriesData<Wind>(pk, start, end);
};

export const getWindLatest = async (siteId: string) => {
  const data = await getWind(siteId, subHours(new Date(), 24), new Date());

  if (data.length < 1) return null;

  return orderBy(data, [(x) => x.timestamp], ["desc"])[0];
};

export const getWaterHeight = async (
  siteId: string,
  start: Date,
  end: Date
): Promise<WaterHeight[]> => {
  const pk = usgsDynamoKeys[UsgsParams.GuageHeight](siteId);
  return queryTimeSeriesData<WaterHeight>(pk, start, end);
};

export const getSalinity = (
  siteId: string,
  start: Date,
  end: Date
): Promise<Salinity[]> => {
  const pk = usgsDynamoKeys[UsgsParams.Salinity](siteId);
  return queryTimeSeriesData<Salinity>(pk, start, end);
};

export const getSalinityLatest = async (siteId: string) => {
  const data = await getSalinity(siteId, subHours(new Date(), 24), new Date());

  if (data.length < 1) return null;

  return orderBy(data, [(x) => x.timestamp], ["desc"])[0];
};

export const getWaterTemperature = async (
  siteId: string,
  start: Date,
  end: Date
): Promise<WaterTemperature[]> => {
  const pk = usgsDynamoKeys[UsgsParams.WaterTemp](siteId);
  return queryTimeSeriesData<WaterTemperature>(pk, start, end);
};

export const getWaterTemperatureLatest = async (siteId: string) => {
  const data = await getWaterTemperature(
    siteId,
    subHours(new Date(), 24),
    new Date()
  );

  if (data.length < 1) return null;

  return orderBy(data, [(x) => x.timestamp], ["desc"])[0];
};

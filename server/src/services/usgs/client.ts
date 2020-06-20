export { getSiteById } from "./source";
import { client, tableName } from "../db";
import { WaterHeight, Salinity, WaterTemperature, Wind } from "./source";
import { subHours } from "date-fns";
import { orderBy } from "lodash";

export const getWind = async (
  siteId: string,
  start: Date,
  end: Date
): Promise<Wind[]> => {
  const pk = `usgs-wind-${siteId}`;
  return queryData<Wind>(pk, start, end);
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
  const pk = `usgs-water-height-${siteId}`;
  return queryData<WaterHeight>(pk, start, end);
};

export const getSalinity = (
  siteId: string,
  start: Date,
  end: Date
): Promise<Salinity[]> => {
  const pk = `usgs-salinity-${siteId}`;
  return queryData<Salinity>(pk, start, end);
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
  const pk = `usgs-water-temp-${siteId}`;
  return queryData<WaterTemperature>(pk, start, end);
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

const queryData = async <T>(
  pk: string,
  start: Date,
  end: Date
): Promise<T[]> => {
  const result = await client
    .query({
      TableName: tableName,
      KeyConditionExpression: "pk = :key AND sk BETWEEN :start AND :end",
      ExpressionAttributeValues: {
        ":key": pk,
        ":start": start.getTime(),
        ":end": end.getTime(),
      },
    })
    .promise();

  if (!result.Items) return [];

  return result.Items.map((item) => ({
    timestamp: new Date(item.sk).toISOString(),
    ...item.data,
  }));
};

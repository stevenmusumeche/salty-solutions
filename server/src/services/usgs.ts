import axios from "axios";
import { LocationEntity } from "./location";
import { orderBy } from "lodash";

export const getWaterHeight = async (
  location: any,
  numDays: number
): Promise<{ timestamp: string; height: number }[]> => {
  return fetchAndMap(location.usgsSiteId, "00065", numDays, (v: any) => ({
    timestamp: new Date(v.dateTime).toISOString(),
    height: Number(v.value)
  }));
};

export const getWaterTemperatureLatest = async (location: LocationEntity) => {
  const data = await getWaterTemperature(location, 24);

  if (data.length < 1) return null;

  return orderBy(data, ["timestamp"], ["desc"])[0];
};

export const getWaterTemperature = async (location: any, numHours: number) => {
  return fetchAndMap(location.usgsSiteId, "00010", numHours, (v: any) => ({
    timestamp: new Date(v.dateTime).toISOString(),
    temperature: {
      degrees: ((Number(v.value) * 9) / 5 + 32).toFixed(1),
      unit: "F"
    }
  }));
};

export const getWindLatest = async (location: LocationEntity) => {
  const data = await getWind(location, 24);

  if (data.length < 1) return null;

  return orderBy(data, ["timestamp"], ["desc"])[0];
};

interface Wind {
  timestamp: string;
  speed: number;
  direction: string;
  directionDegrees: number;
}
export const getWind = async (
  location: any,
  numHours: number
): Promise<Wind[]> => {
  const [speeds, directions] = await Promise.all([
    getWindSpeed(location, numHours),
    getWindDirection(location, numHours)
  ]);

  const combined: Wind[] = [];

  speeds.forEach((speed: any) => {
    const direction = directions.find(
      direction => direction.timestamp === speed.timestamp
    );
    if (direction) {
      combined.push({
        timestamp: speed.timestamp,
        speed: speed.speed,
        direction: direction.direction,
        directionDegrees: direction.degrees
      });
    }
  });

  return combined;
};

const getWindSpeed = async (
  location: any,
  numHours: number
): Promise<{ timestamp: string; speed: number }[]> => {
  return fetchAndMap(location.usgsSiteId, "00035", numHours, (v: any) => ({
    timestamp: new Date(v.dateTime).toISOString(),
    speed: Number(v.value)
  }));
};

const getWindDirection = async (
  location: any,
  numHours: number
): Promise<{ timestamp: string; degrees: number; direction: string }[]> => {
  return fetchAndMap(location.usgsSiteId, "00036", numHours, (v: any) => ({
    timestamp: new Date(v.dateTime).toISOString(),
    degrees: Number(v.value),
    direction: degreesToCompass(Number(v.value))
  }));
};

export const getSalinity = (
  location: any,
  numHours: number
): Promise<{ timestamp: string; salinity: number }[]> => {
  return fetchAndMap(location.usgsSiteId, "00480", numHours, (v: any) => ({
    timestamp: new Date(v.dateTime).toISOString(),
    salinity: +v.value
  }));
};

export const getSalinityLatest = async (location: LocationEntity) => {
  const data = await getSalinity(location, 24);

  if (data.length < 1) return null;

  return orderBy(data, ["timestamp"], ["desc"])[0];
};

async function fetchAndMap(
  siteId: string,
  parameterCode: string,
  numHours: number,
  mapFn: any
) {
  const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${siteId}&period=PT${numHours}H&parameterCd=${parameterCode}&siteStatus=all`;

  const { data } = await axios.get(url);

  if (data.value.timeSeries.length < 1) return [];

  return data.value.timeSeries[0].values[0].value.map(mapFn);
}

export function degreesToCompass(degrees: number): string {
  var val = Math.floor(degrees / 22.5 + 0.5);
  var arr = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW"
  ];
  return arr[val % 16];
}

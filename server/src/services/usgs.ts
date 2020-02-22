import axios from "axios";
import axiosRetry from "axios-retry";
import { LocationEntity } from "./location";
import orderBy from "lodash/orderBy";

axiosRetry(axios, { retries: 3, retryDelay: retryCount => retryCount * 500 });

// https://waterservices.usgs.gov/rest/IV-Service.html
// https://waterwatch.usgs.gov/?m=real&r=la

export const getWaterHeight = async (
  siteId: string,
  start: Date,
  end: Date
): Promise<{ timestamp: string; height: number }[]> => {
  return fetchAndMap(siteId, "00065", { start, end }, (v: any) => ({
    timestamp: new Date(v.dateTime).toISOString(),
    height: Number(v.value)
  }));
};

export const getWaterTemperatureLatest = async (location: LocationEntity) => {
  const data = await getWaterTemperature(location, 24);

  if (data.length < 1) return null;

  return orderBy(data, [x => x.timestamp], ["desc"])[0];
};

export const getWaterTemperature = async (
  location: LocationEntity,
  numHours: number
) => {
  return fetchAndMap(
    location.usgsSites[0].id,
    "00010",
    { numHours },
    (v: any) => ({
      timestamp: new Date(v.dateTime).toISOString(),
      temperature: {
        degrees: ((Number(v.value) * 9) / 5 + 32).toFixed(1),
        unit: "F"
      }
    })
  );
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
  location: LocationEntity,
  numHours: number
): Promise<{ timestamp: string; speed: number }[]> => {
  return fetchAndMap(
    location.usgsSites[0].id,
    "00035",
    { numHours },
    (v: any) => ({
      timestamp: new Date(v.dateTime).toISOString(),
      speed: Number(v.value)
    })
  );
};

const getWindDirection = async (
  location: LocationEntity,
  numHours: number
): Promise<{ timestamp: string; degrees: number; direction: string }[]> => {
  return fetchAndMap(
    location.usgsSites[0].id,
    "00036",
    { numHours },
    (v: any) => ({
      timestamp: new Date(v.dateTime).toISOString(),
      degrees: Number(v.value),
      direction: degreesToCompass(Number(v.value))
    })
  );
};

export const getSalinity = (
  location: LocationEntity,
  numHours: number
): Promise<{ timestamp: string; salinity: number }[]> => {
  return fetchAndMap(
    location.usgsSites[0].id,
    "00480",
    { numHours },
    (v: any) => ({
      timestamp: new Date(v.dateTime).toISOString(),
      salinity: +v.value
    })
  );
};

export const getSalinityLatest = async (location: LocationEntity) => {
  const data = await getSalinity(location, 24);

  if (data.length < 1) return null;

  return orderBy(data, ["timestamp"], ["desc"])[0];
};

type DateInput = { numHours: number } | { start: Date; end: Date };
async function fetchAndMap(
  siteId: string,
  parameterCode: string,
  dateInput: DateInput,
  mapFn: any
) {
  let url;
  if (typeof (dateInput as any).numHours !== "undefined") {
    url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${siteId}&period=PT${
      (dateInput as any).numHours
    }H&parameterCd=${parameterCode}&siteStatus=all`;
  } else {
    url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${siteId}&startDT=${(dateInput as any).start.toISOString()}&endDT=${(dateInput as any).end.toISOString()}&parameterCd=${parameterCode}&siteStatus=all`;
  }

  const { data } = await axios.get(url);

  if (data.value.timeSeries.length < 1) return [];

  return data.value.timeSeries[0].values[0].value
    .filter((v: any) => v.value !== "-999999")
    .map(mapFn);
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

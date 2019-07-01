import axios from "axios";

export const getWaterHeight = async (
  location: any,
  numDays: number
): Promise<{ timestamp: string; height: number }[]> => {
  return fetchAndMap(location.usgsSiteId, "00065", numDays, (v: any) => ({
    timestamp: new Date(v.dateTime).toISOString(),
    height: Number(v.value)
  }));
};

export const getWaterTemperature = async (
  location: any,
  numDays: number
): Promise<{ timestamp: string; temperature: number }[]> => {
  return fetchAndMap(location.usgsSiteId, "00010", numDays, (v: any) => ({
    timestamp: new Date(v.dateTime).toISOString(),
    temperature: ((Number(v.value) * 9) / 5 + 32).toFixed(1)
  }));
};

interface Wind {
  timestamp: string;
  speed: number;
  direction: string;
  directionDegrees: number;
}
export const getWind = async (
  location: any,
  numDays: number
): Promise<Wind[]> => {
  const [speeds, directions] = await Promise.all([
    getWindSpeed(location, numDays),
    getWindDirection(location, numDays)
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
  numDays: number
): Promise<{ timestamp: string; speed: number }[]> => {
  return fetchAndMap(location.usgsSiteId, "00035", numDays, (v: any) => ({
    timestamp: new Date(v.dateTime).toISOString(),
    speed: Number(v.value)
  }));
};

const getWindDirection = async (
  location: any,
  numDays: number
): Promise<{ timestamp: string; degrees: number; direction: string }[]> => {
  return fetchAndMap(location.usgsSiteId, "00036", numDays, (v: any) => ({
    timestamp: new Date(v.dateTime).toISOString(),
    degrees: Number(v.value),
    direction: degreesToCompass(Number(v.value))
  }));
};

export const getSalinity = (
  location: any,
  numDays: number
): Promise<{ timestamp: string; salinity: number }[]> => {
  return fetchAndMap(location.usgsSiteId, "00480", numDays, (v: any) => ({
    timestamp: new Date(v.dateTime).toISOString(),
    salinity: +v.value
  }));
};

async function fetchAndMap(
  siteId: string,
  parameterCode: string,
  numDays: number,
  mapFn: any
) {
  const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${siteId}&period=P${numDays}D&parameterCd=${parameterCode}&siteStatus=all`;

  const { data } = await axios.get(url);

  return data.value.timeSeries[0].values[0].value.map(mapFn);
}

function degreesToCompass(degrees: number): string {
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

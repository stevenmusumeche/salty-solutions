import axios from "axios";
import axiosRetry from "axios-retry";
import { LocationEntity, Coords } from "./location";
import orderBy from "lodash/orderBy";
import { subHours } from "date-fns";

axiosRetry(axios, { retries: 3, retryDelay: retryCount => retryCount * 500 });

enum UsgsParams {
  WaterTemp = "00010",
  WindSpeed = "00035",
  WindDirection = "00036",
  GuageHeight = "00065",
  Salinity = "00480"
}

export interface UsgsSiteEntity {
  id: string;
  name: string;
  coords?: Coords;
  availableParams: UsgsParams[];
}

const usgsSites: UsgsSiteEntity[] = [
  {
    id: "07387040",
    name: "Vermilion Bay near Cypremort Point",
    coords: { lat: 29.7130556, lon: -91.8802778 },
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.WindSpeed,
      UsgsParams.WindDirection,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity
    ]
  },
  {
    id: "08017095",
    name: "N. Calcasieu Lake near Hackberry",
    coords: { lat: 30.0316667, lon: -93.2994444 },
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity
    ]
  },
  {
    id: "07381349",
    name: "Caillou Lake (Sister Lake)",
    coords: { lat: 29.2491667, lon: -90.9211111 },
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.WindSpeed,
      UsgsParams.WindDirection,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity
    ]
  },
  {
    id: "073813498",
    name: "Caillou Bay SW of Cocodrie",
    coords: { lat: 29.0780556, lon: -90.8713889 },
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.WindSpeed,
      UsgsParams.WindDirection,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity
    ]
  },
  {
    id: "07381324",
    name: "Bayou Grand Caillou at Dulac",
    coords: {
      lat: 29.3827778,
      lon: -90.7152778
    },
    availableParams: [UsgsParams.GuageHeight]
  },
  {
    id: "073745257",
    name: "Crooked Bayou near Delacroix",
    coords: { lat: 29.7080556, lon: -89.7194444 },
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity
    ]
  },
  {
    id: "07380249",
    name: "Caminada Pass NW of Grand Isle",
    coords: { lat: 29.2313611, lon: -90.0485278 },
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity
    ]
  },
  {
    id: "292952089453800",
    name: "Port Sulfer",
    coords: { lat: 29.4977778, lon: -89.7605556 },
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity
    ]
  },
  {
    id: "301001089442600",
    name: "Rigolets at Hwy 90 near Slidell",
    coords: { lat: 30.1669444, lon: -89.7405556 },
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity
    ]
  },
  {
    id: "07387050",
    name: "Vermilion Bay at Bayou Fearman near Intracoastal City",
    coords: { lat: 29.6744444, lon: -92.1355556 },
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity
    ]
  },
  {
    id: "073816525",
    name: "Mouth of Atchafalaya River at Atchafalaya Bay",
    coords: { lat: 29.43025, lon: -91.3338889 },
    availableParams: [UsgsParams.GuageHeight]
  },
  {
    id: "08017044",
    name: "Calcasieu River at I-10 at Lake Charles",
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity
    ]
  },
  {
    id: "08017118",
    name: "Calcasieu River at Cameron",
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity
    ]
  }
];

// https://waterservices.usgs.gov/rest/IV-Service.html
// https://waterwatch.usgs.gov/?m=real&r=la

export const getSiteById = (id: string): UsgsSiteEntity | undefined => {
  return usgsSites.find(site => site.id === id);
};

export const getWaterHeight = async (
  siteId: string,
  start: Date,
  end: Date
): Promise<{ timestamp: string; height: number }[]> => {
  return fetchAndMap(
    siteId,
    UsgsParams.GuageHeight,
    { start, end },
    (v: any) => ({
      timestamp: new Date(v.dateTime).toISOString(),
      height: Number(v.value)
    })
  );
};

export const getWaterTemperatureLatest = async (siteId: string) => {
  const data = await getWaterTemperature(
    siteId,
    subHours(new Date(), 24),
    new Date()
  );

  if (data.length < 1) return null;

  return orderBy(data, [x => x.timestamp], ["desc"])[0];
};

export const getWaterTemperature = async (
  siteId: string,
  start: Date,
  end: Date
) => {
  return fetchAndMap(
    siteId,
    UsgsParams.WaterTemp,
    { start, end },
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
    location.usgsSiteIds[0],
    UsgsParams.WindSpeed,
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
    location.usgsSiteIds[0],
    UsgsParams.WindDirection,
    { numHours },
    (v: any) => ({
      timestamp: new Date(v.dateTime).toISOString(),
      degrees: Number(v.value),
      direction: degreesToCompass(Number(v.value))
    })
  );
};

export const getSalinity = (
  siteId: string,
  start: Date,
  end: Date
): Promise<{ timestamp: string; salinity: number }[]> => {
  return fetchAndMap(siteId, UsgsParams.Salinity, { start, end }, (v: any) => ({
    timestamp: new Date(v.dateTime).toISOString(),
    salinity: +v.value
  }));
};

export const getSalinityLatest = async (siteId: string) => {
  const data = await getSalinity(siteId, subHours(new Date(), 24), new Date());

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

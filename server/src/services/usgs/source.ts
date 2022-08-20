import { DocumentClient } from "aws-sdk/clients/dynamodb";
import axios from "axios";
import axiosRetry from "axios-retry";
import { subHours } from "date-fns";
import orderBy from "lodash/orderBy";
import { batchWrite } from "../db";
import { Coords } from "../location";
import { UsgsParam } from "../../generated/graphql";
import { getSiteById } from "./client";
type WriteRequest = DocumentClient.WriteRequest;

axiosRetry(axios, { retries: 3, retryDelay: (retryCount) => retryCount * 500 });

// https://waterservices.usgs.gov/rest/IV-Service.html
// https://waterwatch.usgs.gov/?m=real&r=la

export enum UsgsParams {
  WaterTemp = "00010",
  WindSpeed = "00035",
  WindDirection = "00036",
  GuageHeight = "00065",
  Salinity = "00480",
}

// dynamo primary keys
export const usgsDynamoKeys: Record<UsgsParams, (siteId: string) => string> = {
  [UsgsParams.WindSpeed]: (siteId: string) => `usgs-wind-${siteId}`,
  [UsgsParams.WindDirection]: (siteId: string) => `usgs-wind-${siteId}`,
  [UsgsParams.GuageHeight]: (siteId: string) => `usgs-water-height-${siteId}`,
  [UsgsParams.Salinity]: (siteId: string) => `usgs-salinity-${siteId}`,
  [UsgsParams.WaterTemp]: (siteId: string) => `usgs-water-temp-${siteId}`,
};

export interface UsgsSiteEntity {
  id: string;
  name: string;
  coords?: Coords;
  availableParams: UsgsParams[];
}

export const usgsSites: UsgsSiteEntity[] = [
  {
    id: "07387040",
    name: "Vermilion Bay near Cypremort Point",
    coords: { lat: 29.7130556, lon: -91.8802778 },
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.WindSpeed,
      UsgsParams.WindDirection,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
    ],
  },
  {
    id: "08017095",
    name: "N. Calcasieu Lake near Hackberry",
    coords: { lat: 30.0316667, lon: -93.2994444 },
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
    ],
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
      UsgsParams.Salinity,
    ],
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
      UsgsParams.Salinity,
    ],
  },
  {
    id: "07381324",
    name: "Bayou Grand Caillou at Dulac",
    coords: {
      lat: 29.3827778,
      lon: -90.7152778,
    },
    availableParams: [UsgsParams.GuageHeight],
  },
  {
    id: "073745257",
    name: "Crooked Bayou near Delacroix",
    coords: { lat: 29.7080556, lon: -89.7194444 },
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
    ],
  },
  {
    id: "07380249",
    name: "Caminada Pass NW of Grand Isle",
    coords: { lat: 29.2313611, lon: -90.0485278 },
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
    ],
  },
  {
    id: "292952089453800",
    name: "Port Sulphur",
    coords: { lat: 29.4977778, lon: -89.7605556 },
    availableParams: [
      // UsgsParams.WaterTemp,
      // UsgsParams.GuageHeight,
      // UsgsParams.Salinity,
    ],
  },
  {
    id: "301001089442600",
    name: "Rigolets at Hwy 90 near Slidell",
    coords: { lat: 30.1669444, lon: -89.7405556 },
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
    ],
  },
  {
    id: "07387050",
    name: "Vermilion Bay at Bayou Fearman near Intracoastal City",
    coords: { lat: 29.6744444, lon: -92.1355556 },
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
    ],
  },
  {
    id: "073816525",
    name: "Mouth of Atchafalaya River at Atchafalaya Bay",
    coords: { lat: 29.43025, lon: -91.3338889 },
    availableParams: [UsgsParams.GuageHeight],
  },
  {
    id: "08017044",
    name: "Calcasieu River at I-10 at Lake Charles",
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
    ],
  },
  {
    id: "08017118",
    name: "Calcasieu River at Cameron",
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
    ],
  },
  {
    id: "07381331",
    name: "Intracoastal at Houma",
    // not reporting anymore
    availableParams: [],
  },
  {
    id: "07381328",
    name: "Houma Navigation Canal at Dulac",
    availableParams: [UsgsParams.WindDirection, UsgsParams.WindSpeed],
  },
  {
    id: "073802516",
    name: "Barataria Pass at Grand Isle",
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
      UsgsParams.WindDirection,
      UsgsParams.WindSpeed,
    ],
  },
  {
    id: "291929089562600",
    name: "Barataria Bay near Grand Terre Island",
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
    ],
  },
  {
    id: "073802514",
    name: "Barataria Waterway at Champagne Bay",
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
    ],
  },
  {
    id: "073802512",
    name: "Hackberry Bay Northwest of Grand Isle",
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
    ],
  },
  {
    id: "295206089402400",
    name: "Shell Beach, LA",
    availableParams: [],
  },
  {
    id: "073745235",
    name: "Bayou Dupre Sector Gate near Violet",
    availableParams: [],
  },
  {
    id: "07374526",
    name: "Black Bay near Snake Island",
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
    ],
  },
  {
    id: "07374527",
    name: "Northeast Bay Gardene",
    availableParams: [
      UsgsParams.WindSpeed,
      UsgsParams.WindDirection,
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
    ],
  },
  {
    id: "073802332",
    name: "Inner Harbor Navigation Canal near Seabrook Bridge",
    availableParams: [
      UsgsParams.WindSpeed,
      UsgsParams.WindDirection,
      UsgsParams.GuageHeight,
    ],
  },
  {
    id: "301200090072400",
    name: "Lake Pontchartrain at Causeway",
    availableParams: [UsgsParams.GuageHeight],
  },
  {
    id: "300136090064800",
    name: "Lake Pontchartrain at Metairie",
    availableParams: [UsgsParams.GuageHeight],
  },
  {
    id: "300406090231600",
    name: "I-10 at Bonnne Carre Spillway",
    availableParams: [],
  },
  {
    id: "07374581",
    name: "Bayou Liberty near Slidell",
    availableParams: [UsgsParams.GuageHeight],
  },
  {
    id: "07375230",
    name: "Tchefuncte River at Madisonville",
    availableParams: [UsgsParams.GuageHeight],
  },
  {
    id: "073802341",
    name: "Bayou Bienvenue Floodgate near Chalmette",
    availableParams: [UsgsParams.GuageHeight],
  },
  {
    id: "073802339",
    name: "Intracoastal East Storm Surge Barrier",
    availableParams: [
      UsgsParams.GuageHeight,
      UsgsParams.WindDirection,
      UsgsParams.WindSpeed,
    ],
  },
  {
    id: "300703089522700",
    name: "Pipeline Canal in Bayou Sauvage NWR",
    availableParams: [UsgsParams.GuageHeight],
  },
  {
    id: "291042089153000",
    name: "Pilottown",
    availableParams: [],
  },
  {
    id: "073745258",
    name: "Cow Bayou at American Bay near Pointe-A-La-Hache",
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
    ],
  },
  {
    id: "07380260",
    name: "Empire Waterway south of Empire",
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
    ],
  },
  {
    id: "07374550",
    name: "Mississippi River at Venice",
    availableParams: [UsgsParams.GuageHeight],
  },
  {
    id: "073745275",
    name: "Black Bay near Stone Island near Pointe-A-La-Hache",
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
    ],
  },
  {
    id: "285554089242400",
    name: "Pilots Station E, SW Pass",
    availableParams: [],
  },
  {
    id: "292800090060000",
    name: "Little Lake near Bay Dosgris",
    availableParams: [
      UsgsParams.WindSpeed,
      UsgsParams.WindDirection,
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
    ],
  },
  {
    id: "07380335",
    name: "Little Lake Near Cutoff",
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
    ],
  },
  {
    id: "07380330",
    name: "Bayou Perot at Point Legard",
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
    ],
  },
  {
    id: "07380251",
    name: "Barataria Bay N of Grand Isle",
    availableParams: [
      UsgsParams.WaterTemp,
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
      UsgsParams.WindDirection,
      UsgsParams.WindSpeed,
    ],
  },
  {
    id: "295744093303800",
    name: "Cameron Parish",
    availableParams: [UsgsParams.WaterTemp, UsgsParams.Salinity],
  },
  {
    id: "08042558",
    name: "W Fk Double Bayou at Eagle Ferry Rd",
    availableParams: [UsgsParams.GuageHeight],
  },
  {
    id: "08077637",
    name: "Clear Lake Second Outflow Channel at Kemah, TX",
    availableParams: [UsgsParams.WindSpeed, UsgsParams.WindDirection],
  },
  {
    id: "293229091230800",
    name: "St. Mary Parish",
    availableParams: [
      UsgsParams.GuageHeight,
      UsgsParams.Salinity,
      UsgsParams.WaterTemp,
    ],
  },
];

// go().catch((e) => console.log(e));

async function validateConfig() {
  for (const site of usgsSites) {
    const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${site.id}&siteStatus=all`;
    const response = await axios.get(url);

    for (const param of Object.keys(UsgsParams)) {
      const cur = UsgsParams[param as UsgsParam];
      const supportedParams = response.data.value.timeSeries.map(
        (x: any) => x.variable.variableCode[0].value
      );
      if (
        supportedParams.includes(cur) &&
        !site.availableParams.includes(cur)
      ) {
        console.log("*****available", param);
      }

      if (
        !supportedParams.includes(cur) &&
        site.availableParams.includes(cur)
      ) {
        console.log("*****not available", param);
      }
    }
  }
}

export interface WaterHeight {
  timestamp: string;
  height: number;
}
const getWaterHeight = async (
  siteId: string,
  start: Date,
  end: Date
): Promise<WaterHeight[]> => {
  const data = await fetchAndMap(
    siteId,
    UsgsParams.GuageHeight,
    { start, end },
    (v: any) => ({
      timestamp: new Date(v.dateTime).toISOString(),
      height: Number(v.value),
    })
  );

  return data;
};

export interface WaterTemperature {
  timestamp: string;
  temperature: {
    degrees: number;
    unit: string;
  };
}
const getWaterTemperature = async (
  siteId: string,
  start: Date,
  end: Date
): Promise<WaterTemperature[]> => {
  return fetchAndMap(
    siteId,
    UsgsParams.WaterTemp,
    { start, end },
    (v: any) => ({
      timestamp: new Date(v.dateTime).toISOString(),
      temperature: {
        degrees: Number(((Number(v.value) * 9) / 5 + 32).toFixed(1)),
        unit: "F",
      },
    })
  );
};

export interface Wind {
  timestamp: string;
  speed: number;
  direction: string;
  directionDegrees: number;
}
const getWind = async (
  siteId: string,
  start: Date,
  end: Date
): Promise<Wind[]> => {
  const [speeds, directions] = await Promise.all([
    getWindSpeed(siteId, start, end),
    getWindDirection(siteId, start, end),
  ]);

  const combined: Wind[] = [];

  speeds.forEach((speed: any) => {
    const direction = directions.find(
      (direction) => direction.timestamp === speed.timestamp
    );
    if (direction) {
      combined.push({
        timestamp: speed.timestamp,
        speed: speed.speed,
        direction: direction.direction,
        directionDegrees: direction.degrees,
      });
    }
  });

  return combined;
};

const getWindSpeed = async (
  siteId: string,
  start: Date,
  end: Date
): Promise<{ timestamp: string; speed: number }[]> => {
  return fetchAndMap(
    siteId,
    UsgsParams.WindSpeed,
    { start, end },
    (v: any) => ({
      timestamp: new Date(v.dateTime).toISOString(),
      speed: Number(v.value),
    })
  );
};

const getWindDirection = async (
  siteId: string,
  start: Date,
  end: Date
): Promise<{ timestamp: string; degrees: number; direction: string }[]> => {
  return fetchAndMap(
    siteId,
    UsgsParams.WindDirection,
    { start, end },
    (v: any) => ({
      timestamp: new Date(v.dateTime).toISOString(),
      degrees: Number(v.value),
      direction: degreesToCompass(Number(v.value)),
    })
  );
};

export interface Salinity {
  timestamp: string;
  salinity: number;
}
const getSalinity = (
  siteId: string,
  start: Date,
  end: Date
): Promise<Salinity[]> => {
  return fetchAndMap(siteId, UsgsParams.Salinity, { start, end }, (v: any) => ({
    timestamp: new Date(v.dateTime).toISOString(),
    salinity: +v.value,
  }));
};

async function fetchAndMap(
  siteId: string,
  parameterCode: string,
  dateInput: { start: Date; end: Date },
  mapFn: any
) {
  const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${siteId}&startDT=${dateInput.start.toISOString()}&endDT=${dateInput.end.toISOString()}&parameterCd=${parameterCode}&siteStatus=all`;

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
    "NNW",
  ];
  return arr[val % 16];
}

export async function storeUsgsData(siteId: string, numHours = 24) {
  const site = getSiteById(siteId);
  if (!site) throw new Error(`Unable to load USGS site for ${siteId}`);
  const endDate = new Date();
  const startDate = subHours(endDate, numHours);

  const { waterHeight, salinity, waterTemp, wind } = await scrapeData(
    site,
    startDate,
    endDate
  );

  await saveToDynamo(site, waterHeight, salinity, waterTemp, wind);
}

async function saveToDynamo(
  site: UsgsSiteEntity,
  waterHeight: WaterHeight[],
  salinity: Salinity[],
  waterTemp: WaterTemperature[],
  wind: Wind[]
) {
  const queries = buildQueries(site, waterHeight, salinity, waterTemp, wind);
  await batchWrite(queries);
}

function buildQueries(
  site: UsgsSiteEntity,
  waterHeight: WaterHeight[],
  salinity: Salinity[],
  waterTemp: WaterTemperature[],
  wind: Wind[]
): WriteRequest[] {
  const waterHeightQueries = buildWaterHeightDynamoQueries(
    site.id,
    waterHeight
  );
  const salinityQueries = buildSalinityDynamoQueries(site.id, salinity);
  const waterTempQueries = buildWaterTempDynamoQueries(site.id, waterTemp);
  const windQueries = buildWindDynamoQueries(site.id, wind);
  return [
    ...waterHeightQueries,
    ...salinityQueries,
    ...waterTempQueries,
    ...windQueries,
  ];
}

function buildWindDynamoQueries(siteId: string, wind: Wind[]): WriteRequest[] {
  const queries = wind.map((data) => {
    const { timestamp, ...itemData } = data;
    const itemDate = new Date(timestamp);
    return {
      PutRequest: {
        Item: {
          pk: `usgs-wind-${siteId}`,
          sk: itemDate.getTime(),
          updatedAt: new Date().toISOString(),
          data: itemData,
        },
      },
    };
  });
  return queries;
}

function buildWaterTempDynamoQueries(
  siteId: string,
  waterTemp: WaterTemperature[]
): WriteRequest[] {
  const queries = waterTemp.map((data) => {
    const { timestamp, ...itemData } = data;
    const itemDate = new Date(timestamp);
    return {
      PutRequest: {
        Item: {
          pk: `usgs-water-temp-${siteId}`,
          sk: itemDate.getTime(),
          updatedAt: new Date().toISOString(),
          data: itemData,
        },
      },
    };
  });
  return queries;
}

function buildSalinityDynamoQueries(
  siteId: string,
  salinity: Salinity[]
): WriteRequest[] {
  const queries = salinity.map((data) => {
    const { timestamp, ...itemData } = data;
    const itemDate = new Date(timestamp);
    return {
      PutRequest: {
        Item: {
          pk: `usgs-salinity-${siteId}`,
          sk: itemDate.getTime(),
          updatedAt: new Date().toISOString(),
          data: itemData,
        },
      },
    };
  });
  return queries;
}

function buildWaterHeightDynamoQueries(
  siteId: string,
  waterHeight: WaterHeight[]
): WriteRequest[] {
  const queries = waterHeight.map((data) => {
    const { timestamp, ...itemData } = data;
    const itemDate = new Date(timestamp);
    return {
      PutRequest: {
        Item: {
          pk: `usgs-water-height-${siteId}`,
          sk: itemDate.getTime(),
          updatedAt: new Date().toISOString(),
          data: itemData,
        },
      },
    };
  });
  return queries;
}

async function scrapeData(site: UsgsSiteEntity, start: Date, end: Date) {
  const [waterHeight, salinity, waterTemp, wind] = await Promise.all([
    getWaterHeight(site.id, start, end),
    getSalinity(site.id, start, end),
    getWaterTemperature(site.id, start, end),
    getWind(site.id, start, end),
  ]);

  return { waterHeight, salinity, waterTemp, wind };
}

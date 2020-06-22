import { DocumentClient } from "aws-sdk/clients/dynamodb";
import axios from "axios";
import axiosRetry from "axios-retry";
import { subHours } from "date-fns";
import { formatToTimeZone } from "date-fns-timezone";
import querystring from "querystring";
import {
  AirPressure,
  TemperatureDetail,
  WaterHeight,
  WindDetail,
} from "../../generated/graphql";
import { batchWrite } from "../db";
import { degreesToCompass } from "../usgs/source";
import { knotsToMph } from "../wind-finder";
import { getStationById, getTidePredictions } from "./tide";
type WriteRequest = DocumentClient.WriteRequest;

// https://www.ndbc.noaa.gov/
// https://tidesandcurrents.noaa.gov/api/
// https://tidesandcurrents.noaa.gov/api/responseHelp.html

// tide stations in LA: https://tidesandcurrents.noaa.gov/tide_predictions.html?gid=1400
// tide station map: https://tidesandcurrents.noaa.gov/map/index.html
// better map: https://tidesandcurrents.noaa.gov/map/index.html?type=TidePredictions&region=

axiosRetry(axios, { retries: 3, retryDelay: (retryCount) => retryCount * 500 });

enum NoaaProduct {
  Wind = "wind",
  WaterLevel = "water_level",
  AirTemperature = "air_temperature",
  WaterTemperature = "water_temperature",
  AirPressure = "air_pressure",
  TidePrediction = "predictions",
}

export interface NoaaStationEntity {
  id: string;
  name: string;
  coords: {
    lat: number;
    lon: number;
  };
  supportedProducts: NoaaProduct[];
}

export const noaaStations: NoaaStationEntity[] = [
  {
    id: "8765551",
    name: "Southwest Pass, Vermilion Bay",
    coords: { lat: 29.58, lon: -92.035 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8765148",
    name: "Weeks Bay, LA",
    coords: { lat: 29.837, lon: -91.837 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8768094",
    name: "Calcasieu Pass",
    coords: { lat: 29.7683, lon: -93.3433 },
    supportedProducts: [
      NoaaProduct.TidePrediction,
      NoaaProduct.Wind,
      NoaaProduct.WaterLevel,
      NoaaProduct.AirTemperature,
      NoaaProduct.WaterTemperature,
      NoaaProduct.AirPressure,
    ],
  },
  {
    id: "8767961",
    name: "Bulk Terminal near Prien Lake",
    coords: { lat: 30.19, lon: -93.3 },
    supportedProducts: [
      NoaaProduct.TidePrediction,
      NoaaProduct.WaterLevel,
      NoaaProduct.WaterTemperature,
    ],
  },
  {
    id: "8767816",
    name: "Lake Charles",
    coords: { lat: 30.223333, lon: -93.221667 },
    supportedProducts: [
      NoaaProduct.TidePrediction,
      NoaaProduct.WaterLevel,
      NoaaProduct.AirTemperature,
      NoaaProduct.WaterTemperature,
      NoaaProduct.AirPressure,
    ],
  },
  {
    id: "8765251",
    name: "Cypremort Point",
    coords: { lat: 29.7133, lon: -91.88 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8764931",
    name: "Cote Blanche Island",
    coords: { lat: 29.735, lon: -91.7133 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8763206",
    name: "Caillou Boca",
    coords: { lat: 29.0633333, lon: -90.8066667 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8763506",
    name: "Raccoon Point, Isle Dernieres",
    coords: { lat: 29.0633333, lon: -90.9616667 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8762888",
    name: "E. Isle Dernieres, Lake Pelto",
    coords: { lat: 29.0716667, lon: -90.64 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8762928",
    name: "Cocodrie, Terrebonne Bay",
    coords: { lat: 29.245, lon: -90.6616667 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8762850",
    name: "Wine Island, Terrebonne Bay",
    coords: { lat: 29.0783333, lon: -90.5866667 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8762481",
    name: "Pelican Islands, Timbalier Bay",
    coords: { lat: 29.1283333, lon: -90.4233333 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8765568",
    name: "Lighthouse Point",
    coords: { lat: 29.5233333, lon: -92.0433333 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8764931",
    name: "Cote Blanche Island, West Cote Blanche Bay",
    coords: { lat: 29.735, lon: -91.7133333 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8765026",
    name: "Marsh Island, Atchafalaya Bay",
    coords: { lat: 29.485, lon: -91.7633333 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8761819",
    name: "Texaco Dock, Hackberry",
    coords: { lat: 29.4016667, lon: -90.0383333 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8762675",
    name: "Timbalier Island, Timbalier Bay",
    coords: { lat: 29.0866667, lon: -90.5266667 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8761305",
    name: "Shell Beach",
    coords: { lat: 29.8683333, lon: -89.6733333 },
    supportedProducts: [
      NoaaProduct.TidePrediction,
      NoaaProduct.Wind,
      NoaaProduct.WaterLevel,
      NoaaProduct.AirTemperature,
      NoaaProduct.WaterTemperature,
      NoaaProduct.AirPressure,
    ],
  },
  {
    id: "8761529",
    name: "Martello Castle, Lake Borgne",
    coords: { lat: 29.945, lon: -89.835 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8760742",
    name: "Comfort Island",
    coords: { lat: 29.8233333, lon: -89.27 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8761108",
    name: "Bay Gardene",
    coords: { lat: 29.5983333, lon: -89.6183333 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8760595",
    name: "Breton Island",
    coords: { lat: 29.4933333, lon: -89.1733333 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8761724",
    name: "Grand Isle",
    coords: { lat: 29.2633333, lon: -89.9566667 },
    supportedProducts: [
      NoaaProduct.TidePrediction,
      NoaaProduct.Wind,
      NoaaProduct.WaterLevel,
      NoaaProduct.WaterTemperature,
    ],
  },
  {
    id: "8761826",
    name: "Caminada Pass",
    coords: { lat: 29.21, lon: -90.04 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8761687",
    name: "Barataria Pass",
    coords: { lat: 29.275, lon: -89.945 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8761677",
    name: "Independence Island",
    coords: { lat: 29.31, lon: -89.9383333 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8761742",
    name: "Mendicant Island, Barataria Bay",
    coords: { lat: 29.3183333, lon: -89.98 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8762075",
    name: "Port Fourchon, Belle Pass",
    coords: { lat: 29.1133333, lon: -90.1983333 },
    supportedProducts: [NoaaProduct.TidePrediction, NoaaProduct.WaterLevel],
  },
  {
    id: "8760721",
    name: "Pilottown",
    coords: { lat: 29.1783333, lon: -89.2583333 },
    supportedProducts: [
      NoaaProduct.TidePrediction,
      NoaaProduct.Wind,
      NoaaProduct.WaterLevel,
      NoaaProduct.AirTemperature,
      NoaaProduct.WaterTemperature,
      NoaaProduct.AirPressure,
    ],
  },
  {
    id: "8760736",
    name: "Joseph Bayou",
    coords: { lat: 29.0583333, lon: -89.2716667 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8760551",
    name: "South Pass",
    coords: { lat: 28.99, lon: -89.14 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8760579",
    name: "Port Eads, South Pass",
    coords: { lat: 29.015, lon: -89.16 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8760922",
    name: "Pilots Station East, Southwest Pass",
    coords: { lat: 28.9316667, lon: -89.4066667 },
    supportedProducts: [
      NoaaProduct.TidePrediction,
      NoaaProduct.Wind,
      NoaaProduct.WaterLevel,
      NoaaProduct.AirTemperature,
      NoaaProduct.AirPressure,
    ],
  },
  {
    id: "8760959",
    name: "Southwest Pass",
    coords: { lat: 28.9316667, lon: -89.4283333 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8760416",
    name: "Southeast Pass",
    coords: { lat: 29.1166667, lon: -89.045 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8760412",
    name: "North Pass, Pass a Loutre",
    coords: { lat: 29.205, lon: -89.0366667 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8760424",
    name: "Lonesome Bayou (Thomasin)",
    coords: { lat: 29.2283333, lon: -89.05 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8760841",
    name: "Jack Bay",
    coords: { lat: 29.3666667, lon: -89.345 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8760889",
    name: "Olga Compressor Station, Grand Bay",
    coords: { lat: 29.3866667, lon: -89.38 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8761212",
    name: "Empire Jetty",
    coords: { lat: 29.25, lon: -89.6083333 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8761402",
    name: "The Rigolets",
    coords: { lat: 30.1666667, lon: -89.7366667 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8761487",
    name: "Chef Menteur, Chef Menteur Pass",
    coords: { lat: 30.065, lon: -89.8 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8761927",
    name: "New Canal Station",
    coords: { lat: 30.0266667, lon: -90.1133333 },
    supportedProducts: [
      NoaaProduct.TidePrediction,
      NoaaProduct.Wind,
      NoaaProduct.WaterLevel,
      NoaaProduct.AirTemperature,
      NoaaProduct.WaterTemperature,
      NoaaProduct.AirPressure,
    ],
  },
  {
    id: "TEC4445",
    name: "Paris Road Bridge (ICWW)",
    coords: { lat: 30, lon: -89.9333333 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8761473",
    name: "Route 433, Bayou Bonfouca",
    coords: { lat: 30.2716667, lon: -89.7933333 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8761993",
    name: "Tchefuncta River, Lake Point",
    coords: { lat: 30.3783333, lon: -90.16 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8762372",
    name: "East Bank 1, Norco, Bayou LaBranche",
    coords: { lat: 30.05, lon: -90.3683333 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8762483",
    name: "I-10 Bonnet Carre Floodway",
    coords: { lat: 888, lon: 888 },
    supportedProducts: [NoaaProduct.TidePrediction, NoaaProduct.WaterLevel],
  },
  {
    id: "8763535",
    name: "Texas Gas Platform, Caillou Bay",
    coords: { lat: 29.175, lon: -90.9766667 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8763719",
    name: "Ship Shoal Light",
    coords: { lat: 28.915, lon: -91.0716667 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8761732",
    name: "Manilla, LA",
    coords: { lat: 29.4266667, lon: -89.97667 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
  {
    id: "8761899",
    name: "Lafitte, Barataria Waterway",
    coords: { lat: 29.6666667, lon: -90.111667 },
    supportedProducts: [NoaaProduct.TidePrediction],
  },
];

export async function storeNoaaData(stationId: string, numHours = 24) {
  const station = getStationById(stationId);
  if (!station) throw new Error(`Unable to load NOAA station for ${stationId}`);
  const endDate = new Date();
  const startDate = subHours(endDate, numHours);

  const data = await scrapeData(station, startDate, endDate);
  await saveToDynamo(station, data);
}

async function saveToDynamo(station: NoaaStationEntity, data: ScrapedData) {
  const queries = buildDynamoQueries(station.id, data);
  await batchWrite(queries);
}

function buildDynamoQueries(
  stationId: string,
  data: ScrapedData
): WriteRequest[] {
  const allQueries = [];
  for (const product in data) {
    const queries = data[product].map((data) => {
      const { timestamp, ...itemData } = data;
      const itemDate = new Date(timestamp);
      return {
        PutRequest: {
          Item: {
            pk: `noaa-${product}-${stationId}`,
            sk: itemDate.getTime(),
            updatedAt: new Date().toISOString(),
            data: itemData,
          },
        },
      };
    });

    allQueries.push(...queries);
  }

  return allQueries;
}

interface ScrapedData {
  [product: string]: any[];
}
async function scrapeData(
  station: NoaaStationEntity,
  start: Date,
  end: Date
): Promise<ScrapedData> {
  let returnVal: ScrapedData = {};

  const stations = station.supportedProducts.filter(
    (x) => x !== NoaaProduct.TidePrediction
  );

  for (const product of stations) {
    const data = await fetchDataForProduct(product, station.id, start, end);

    returnVal[product] = data;
  }

  return returnVal;
}

// async function updateStationSupportData() {
//   for (const station of noaaStations) {
//     let windData = await fetchDataForProduct(
//       NoaaProduct.Wind,
//       station.id,
//       subDays(new Date(), 1),
//       new Date()
//     );
//     const hasWind = windData.length > 0;

//     const waterLevelData = await fetchDataForProduct(
//       NoaaProduct.WaterLevel,
//       station.id,
//       subDays(new Date(), 1),
//       new Date()
//     );
//     const hasWaterLevel = waterLevelData.length > 0;

//     const airTempData = await fetchDataForProduct(
//       NoaaProduct.AirTemperature,
//       station.id,
//       subDays(new Date(), 1),
//       new Date()
//     );
//     const hasAirTemp = airTempData.length > 0;

//     const waterTempData = await fetchDataForProduct(
//       NoaaProduct.WaterTemperature,
//       station.id,
//       subDays(new Date(), 1),
//       new Date()
//     );
//     const hasWaterTemp = waterTempData.length > 0;

//     const airPressureData = await fetchDataForProduct(
//       NoaaProduct.AirPressure,
//       station.id,
//       subDays(new Date(), 1),
//       new Date()
//     );
//     const hasAirPressure = airPressureData.length > 0;

//     console.log(`  {
//       id: "${station.id}",
//       name: "${station.name}",
//       coords: { lat: ${station.coords.lat}, lon: ${station.coords.lon} },
//       supportedProducts: [NoaaProduct.TidePrediction, ${
//         hasWind ? `NoaaProduct.Wind,` : ""
//       }${hasWaterLevel ? "NoaaProduct.WaterLevel," : ""}${
//       hasAirTemp ? "NoaaProduct.AirTemperature," : ""
//     }${hasWaterTemp ? "NoaaProduct.WaterTemperature," : ""}${
//       hasAirPressure ? "NoaaProduct.AirPressure," : ""
//     }],
//     },`);
//   }
// }

const mappers = {
  [NoaaProduct.Wind]: (data: WindApiResponse): WindDetail[] => {
    return data.data.map((datum) => {
      return {
        timestamp: new Date(`${datum.t}:00+00:00`).toISOString(),
        speed: knotsToMph(Number(datum.s)),
        gusts: knotsToMph(Number(datum.g)),
        direction: degreesToCompass(Number(datum.d)),
        directionDegrees: Number(datum.d),
      };
    });
  },
  [NoaaProduct.WaterLevel]: (data: WaterLevelApiResponse): WaterHeight[] => {
    return data.data.map((datum) => {
      return {
        timestamp: new Date(`${datum.t}:00+00:00`).toISOString(),
        height: knotsToMph(Number(datum.v)),
      };
    });
  },
  [NoaaProduct.AirTemperature]: (
    data: TemperatureApiResponse
  ): TemperatureDetail[] => {
    return data.data.map((datum) => {
      return {
        timestamp: new Date(`${datum.t}:00+00:00`).toISOString(),
        temperature: { degrees: Number(datum.v), unit: "F" },
      };
    });
  },
  [NoaaProduct.WaterTemperature]: (
    data: TemperatureApiResponse
  ): TemperatureDetail[] => {
    return data.data.map((datum) => {
      return {
        timestamp: new Date(`${datum.t}:00+00:00`).toISOString(),
        temperature: { degrees: Number(datum.v), unit: "F" },
      };
    });
  },
  [NoaaProduct.AirPressure]: (data: AirPressureApiResponse): AirPressure[] => {
    return data.data.map((datum) => {
      return {
        timestamp: new Date(`${datum.t}:00+00:00`).toISOString(),
        pressure: Number(datum.v),
      };
    });
  },
};

async function fetchDataForProduct(
  product: NoaaProduct,
  stationId: string,
  start: Date,
  end: Date
): Promise<any> {
  if (product === NoaaProduct.TidePrediction) {
    return await getTidePredictions(start, end, stationId);
  }

  const params = {
    product: product,
    application: "fishing",
    begin_date: formatToTimeZone(start, "YYYYMMDD HH:mm", {
      timeZone: "Etc/UTC",
    }),
    end_date: formatToTimeZone(end, "YYYYMMDD HH:mm", {
      timeZone: "Etc/UTC",
    }),
    datum: "MLLW",
    station: stationId,
    time_zone: "gmt",
    units: "english",
    format: "json",
  };

  const url =
    `https://tidesandcurrents.noaa.gov/api/datagetter?` +
    querystring.stringify(params);

  const { data } = await axios.get(url);
  if (data.error) return [];

  return mappers[product](data);
}

interface WindApiResponse {
  data: Array<{
    t: string; // timestamp
    s: string; // speed (knots)
    d: string; // direction degrees
    g: string; // gusts (knots)
  }>;
}

interface WaterLevelApiResponse {
  data: {
    t: string; // timestamp
    v: string; // Value - Measured water level height
    q: string; // Quality Assurance/Quality Control level, p = preliminary, v = verified
  }[];
}

interface TemperatureApiResponse {
  data: {
    t: string; // timestamp
    v: string; // Value - Measured air temperature
  }[];
}

interface AirPressureApiResponse {
  data: {
    t: string; // timestamp
    v: string; // Value - Measured air pressure
  }[];
}

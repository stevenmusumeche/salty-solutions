import axios from "axios";
import {
  addDays,
  addMinutes,
  differenceInMinutes,
  isAfter,
  isBefore,
  subDays
} from "date-fns";
import { formatToTimeZone } from "date-fns-timezone";
import querystring from "querystring";

export interface TideStationEntity {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

const tideStations: TideStationEntity[] = [
  {
    id: "8765551",
    name: "Southwest Pass, Vermilion Bay",
    lat: 29.58,
    lon: -92.035
  },
  {
    id: "8765148",
    name: "Weeks Bay, LA",
    lat: 29.837,
    lon: -91.837
  },
  {
    id: "8768094",
    name: "Calcasieu Pass",
    lat: 29.7683,
    lon: -93.3433
  },
  {
    id: "8767961",
    name: "Bulk Terminal",
    lat: 30.19,
    lon: -93.3
  },
  {
    id: "8767816",
    name: "Lake Charles",
    lat: 30.223333,
    lon: -93.221667
  },
  {
    id: "8765251",
    name: "Cypremort Point",
    lat: 29.7133,
    lon: -91.88
  },
  {
    id: "8764931",
    name: "Cote Blanche Island",
    lat: 29.735,
    lon: -91.7133
  },
  { id: "8763206", name: "Caillou Boca", lat: 29.0633333, lon: -90.8066667 },
  {
    id: "8763506",
    name: "Raccoon Point, Isle Dernieres",
    lat: 29.0633333,
    lon: -90.9616667
  },
  {
    id: "8762888",
    name: "E. Isle Dernieres, Lake Pelto",
    lat: 29.0716667,
    lon: -90.64
  },
  {
    id: "8762928",
    name: "Cocodrie, Terrebonne Bay",
    lat: 29.245,
    lon: -90.6616667
  },
  {
    id: "8762850",
    name: "Wine Island, Terrebonne Bay",
    lat: 29.0783333,
    lon: -90.5866667
  },
  {
    id: "8762481",
    name: "Pelican Islands, Timbalier Bay",
    lat: 29.1283333,
    lon: -90.4233333
  },
  {
    id: "8765568",
    name: "Lighthouse Point",
    lat: 29.5233333,
    lon: -92.0433333
  },
  {
    id: "8764931",
    name: "Cote Blanche Island, West Cote Blanche Bay",
    lat: 29.735,
    lon: -91.7133333
  },
  {
    id: "8765026",
    name: "Marsh Island, Atchafalaya Bay",
    lat: 29.485,
    lon: -91.7633333
  },
  {
    id: "8761819",
    name: "Texaco Dock, Hackberry",
    lat: 29.4016667,
    lon: -90.0383333
  },
  {
    id: "8762675",
    name: "Timbalier Island, Timbalier Bay",
    lat: 29.0866667,
    lon: -90.5266667
  },
  { id: "8761305", name: "Shell Beach", lat: 29.8683333, lon: -89.6733333 },
  {
    id: "8761529",
    name: "Martello Castle, Lake Borgne",
    lat: 29.945,
    lon: -89.835
  },
  { id: "8760742", name: "Comfort Island", lat: 29.8233333, lon: -89.27 },
  { id: "8761108", name: "Bay Gardene", lat: 29.5983333, lon: -89.6183333 },
  { id: "8760595", name: "Breton Island", lat: 29.4933333, lon: -89.1733333 },
  { id: "8761724", name: "Grand Isle", lat: 888, lon: 888 },
  { id: "8761826", name: "Caminada Pass", lat: 888, lon: 888 },
  { id: "8761687", name: "Barataria Pass", lat: 888, lon: 888 },
  { id: "8761677", name: "Independence Island", lat: 888, lon: 888 },
  {
    id: "8761742",
    name: "Mendicant Island, Barataria Bay",
    lat: 888,
    lon: 888
  },
  { id: "8762075", name: "Port Fourchon, Belle Pass", lat: 888, lon: 888 },
  { id: "8760721", name: "Pilottown", lat: 888, lon: 888 },
  { id: "8760736", name: "Joseph Bayou", lat: 888, lon: 888 },
  { id: "8760551", name: "South Pass", lat: 888, lon: 888 },
  { id: "8760579", name: "Port Eads, South Pass", lat: 888, lon: 888 },
  {
    id: "8760922",
    name: "Pilots Station East, Southwest Pass",
    lat: 888,
    lon: 888
  },
  { id: "8760959", name: "Southwest Pass", lat: 888, lon: 888 },
  { id: "8760416", name: "Southeast Pass", lat: 888, lon: 888 },
  { id: "8760412", name: "North Pass, Pass a Loutre", lat: 888, lon: 888 },
  { id: "8760424", name: "Lonesome Bayou (Thomasin)", lat: 888, lon: 888 },
  { id: "8760841", name: "Jack Bay", lat: 888, lon: 888 },
  {
    id: "8760889",
    name: "Olga Compressor Station, Grand Bay",
    lat: 888,
    lon: 888
  },
  { id: "8761212", name: "Empire Jetty", lat: 888, lon: 888 },
  { id: "8761402", name: "The Rigolets", lat: 888, lon: 888 },
  {
    id: "8761487",
    name: "Chef Menteur, Chef Menteur Pass",
    lat: 888,
    lon: 888
  },
  { id: "8761927", name: "New Canal Station", lat: 888, lon: 888 },
  //
  { id: "TEC4445", name: "Paris Road Bridge (ICWW)", lat: 888, lon: 888 },
  { id: "8761473", name: "Route 433, Bayou Bonfouca", lat: 888, lon: 888 },
  { id: "8761993", name: "Tchefuncta River, Lake Point", lat: 888, lon: 888 },
  {
    id: "8762372",
    name: "East Bank 1, Norco, Bayou LaBranche",
    lat: 888,
    lon: 888
  },
  { id: "8762483", name: "I-10 Bonnet Carre Floodway", lat: 888, lon: 888 },
  {
    id: "8763535",
    name: "Texas Gas Platform, Caillou Bay",
    lat: 29.175,
    lon: -90.9766667
  },
  {
    id: "8763719",
    name: "Ship Shoal Light",
    lat: 28.915,
    lon: -91.0716667
  }
];

// tide stations in LA: https://tidesandcurrents.noaa.gov/tide_predictions.html?gid=1400
// tide station map: https://tidesandcurrents.noaa.gov/map/index.html
// better map: https://tidesandcurrents.noaa.gov/map/index.html?type=TidePredictions&region=

export const getStationById = (id: string): TideStationEntity | undefined => {
  return tideStations.find(tideStation => tideStation.id === id);
};

interface Normalized {
  time: string;
  height: number;
  type: string;
}

export async function getTidePredictions(
  start: Date,
  end: Date,
  stationId: string
): Promise<{ time: string; height: number; type: string }[]> {
  const [hiLoData, allData] = await Promise.all([
    fetchTideData(subDays(start, 1), addDays(end, 1), stationId, true),
    fetchTideData(start, end, stationId, false)
  ]);

  let data = allData.concat(hiLoData);

  let normalized: Normalized[] = data.map(data => ({
    time: new Date(`${data.t}:00+00:00`).toISOString(),
    height: Number(data.v),
    type:
      data.type === "L" ? "low" : data.type === "H" ? "high" : "intermediate"
  }));

  // is this a tide station with only hi/lo values?
  if (allData.length === 0) {
    normalized = await extrapolateFromHiLow(normalized);
  }

  return normalized
    .filter(entry => {
      const entryTime = new Date(entry.time);
      if (isBefore(entryTime, start) || isAfter(entryTime, end)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const aDate = new Date(a.time);
      const bDate = new Date(b.time);

      if (aDate > bDate) return 1;
      else if (aDate < bDate) return -1;

      return 0;
    });
}

interface NoaaPrediction {
  t: string;
  v: string;
  type?: "L" | "H";
}

/**
 * API docs: https://tidesandcurrents.noaa.gov/api/
 */
async function fetchTideData(
  start: Date,
  end: Date,
  stationId: string,
  onlyHighLow: boolean
): Promise<NoaaPrediction[]> {
  const params = {
    product: "predictions",
    application: "fishing",
    begin_date: formatToTimeZone(start, "YYYYMMDD HH:mm", {
      timeZone: "Etc/UTC"
    }),
    end_date: formatToTimeZone(end, "YYYYMMDD HH:mm", { timeZone: "Etc/UTC" }),
    datum: "MLLW",
    station: stationId,
    time_zone: "gmt",
    units: "english",
    interval: onlyHighLow ? "hilo" : undefined, // only High/Low tide predictions vs 6-minute intervals
    format: "json"
  };

  const url =
    `https://tidesandcurrents.noaa.gov/api/datagetter?` +
    querystring.stringify(params);

  const { data } = await axios.get<{ predictions: NoaaPrediction[] }>(url);

  return data.predictions || [];
}

async function extrapolateFromHiLow(data: Normalized[]) {
  let final: Normalized[] = [];
  for (let i = 0; i < data.length - 1; i++) {
    const a = data[i];
    const b = data[i + 1];

    // find time diff between consecutive entries
    const minuteDiff = differenceInMinutes(new Date(b.time), new Date(a.time));

    final.push(a);
    for (let j = 1; j < minuteDiff; j++) {
      // insert calculated step values
      const time = addMinutes(new Date(a.time), j);
      const percentDone = j / minuteDiff;
      final.push({
        time: time.toISOString(),
        height: lerp(a.height, b.height, inOutQuad(percentDone)),
        type: "intermediate"
      });
    }

    if (i === data.length - 2) final.push(b);
  }

  return final;
}

function lerp(v0: number, v1: number, t: number) {
  return v0 * (1 - t) + v1 * t;
}

function inOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

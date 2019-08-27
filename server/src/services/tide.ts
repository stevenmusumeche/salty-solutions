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
  lat?: number;
  long?: number;
}

const tideStations: TideStationEntity[] = [
  {
    id: "8765551",
    name: "Southwest Pass, Vermilion Bay",
    lat: 29.58,
    long: -92.035
  },
  {
    id: "8765148",
    name: "Weeks Bay, LA",
    lat: 29.837,
    long: -91.837
  },
  {
    id: "8768094",
    name: "Calcasieu Pass",
    lat: 29.7683,
    long: -93.3433
  },
  {
    id: "8767961",
    name: "Bulk Terminal",
    lat: 30.19,
    long: -93.3
  },
  {
    id: "8767816",
    name: "Lake Charles",
    lat: 30.223333,
    long: -93.221667
  },
  {
    id: "8765251",
    name: "Cypremort Point",
    lat: 29.7133,
    long: -91.88
  },
  {
    id: "8764931",
    name: "Cote Blanche Island",
    lat: 29.735,
    long: -91.7133
  },
  { id: "8763206", name: "Caillou Boca" },
  { id: "8763506", name: "Raccoon Point, Isle Dernieres" },
  { id: "8762888", name: "E. Isle Dernieres, Lake Pelto" },
  { id: "8762928", name: "Cocodrie, Terrebonne Bay" },
  { id: "8762850", name: "Wine Island, Terrebonne Bay" },
  { id: "8762481", name: "Pelican Islands, Timbalier Bay" }
];

// tide stations: https://tidesandcurrents.noaa.gov/tide_predictions.html?gid=1400

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

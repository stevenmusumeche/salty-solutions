import axios from "axios";
import axiosRetry from "axios-retry";
import {
  addDays,
  addMinutes,
  differenceInMinutes,
  isAfter,
  isBefore,
  subDays,
} from "date-fns";
import { formatToTimeZone } from "date-fns-timezone";
import querystring from "querystring";
import { NoaaStationEntity, noaaStations } from "./source";

axiosRetry(axios, { retries: 3, retryDelay: (retryCount) => retryCount * 500 });

export const getStationById = (id: string): NoaaStationEntity | undefined => {
  return noaaStations.find((tideStation) => tideStation.id === id);
};

export interface TideData {
  timestamp: string;
  height: number;
  type: string;
}

export async function getTidePredictions(
  start: Date,
  end: Date,
  stationId: string
): Promise<TideData[]> {
  const [hiLoData, allData] = await Promise.all([
    fetchTideData(subDays(start, 1), addDays(end, 1), stationId, true),
    fetchTideData(start, end, stationId, false),
  ]);

  let data = allData.concat(hiLoData);

  let normalized: TideData[] = data.map((data) => ({
    timestamp: new Date(`${data.t}:00+00:00`).toISOString(),
    height: Number(data.v),
    type:
      data.type === "L" ? "low" : data.type === "H" ? "high" : "intermediate",
  }));

  // is this a tide station with only hi/lo values?
  if (allData.length === 0) {
    normalized = await extrapolateFromHiLow(normalized);
  }

  const result = normalized
    .filter((entry) => {
      const entryTime = new Date(entry.timestamp);
      if (isBefore(entryTime, start) || isAfter(entryTime, end)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const aDate = new Date(a.timestamp);
      const bDate = new Date(b.timestamp);

      if (aDate > bDate) return 1;
      else if (aDate < bDate) return -1;

      return 0;
    });

  return result;
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
      timeZone: "Etc/UTC",
    }),
    end_date: formatToTimeZone(end, "YYYYMMDD HH:mm", {
      timeZone: "Etc/UTC",
    }),
    datum: "MLLW",
    station: stationId,
    time_zone: "gmt",
    units: "english",
    interval: onlyHighLow ? "hilo" : undefined, // only High/Low tide predictions vs 6-minute intervals
    format: "json",
  };

  const url =
    `https://tidesandcurrents.noaa.gov/api/datagetter?` +
    querystring.stringify(params);

  const { data } = await axios.get<{ predictions: NoaaPrediction[] }>(url);

  return data.predictions || [];
}

async function extrapolateFromHiLow(data: TideData[]) {
  let final: TideData[] = [];
  for (let i = 0; i < data.length - 1; i++) {
    const a = data[i];
    const b = data[i + 1];

    // find time diff between consecutive entries
    const minuteDiff = differenceInMinutes(
      new Date(b.timestamp),
      new Date(a.timestamp)
    );

    final.push(a);
    for (let j = 1; j < minuteDiff; j++) {
      // insert calculated step values
      const time = addMinutes(new Date(a.timestamp), j);
      const percentDone = j / minuteDiff;
      final.push({
        timestamp: time.toISOString(),
        height: lerp(a.height, b.height, inOutQuad(percentDone)),
        type: "intermediate",
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

import querystring from "querystring";
import axios from "axios";
import { formatToTimeZone } from "date-fns-timezone";
import { format, parse } from "date-fns";

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

export async function getTidePredictions(
  start: Date,
  end: Date,
  stationId: string
): Promise<{ time: string; height: number; type: string }[]> {
  const [hiLoData, allData] = await Promise.all([
    fetchTideData(start, end, stationId, true),
    fetchTideData(start, end, stationId, false)
  ]);

  // is this a tide station with only hi/lo values?
  if (allData.length === 0) {
    console.log(hiLoData);
  }

  const data = allData.concat(hiLoData);

  const normalized = data
    .map(data => ({
      time: new Date(`${data.t}:00+00:00`).toISOString(),
      height: Number(data.v),
      type:
        data.type === "L" ? "low" : data.type === "H" ? "high" : "intermediate"
    }))
    .sort((a, b) => {
      const aDate = new Date(a.time);
      const bDate = new Date(b.time);

      if (aDate > bDate) return 1;
      else if (aDate < bDate) return -1;

      return 0;
    });

  return normalized;
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

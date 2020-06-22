import { NoaaStationEntity, noaaStations } from "./source";
import { TideData } from "./source-tide";
import { queryTimeSeriesData } from "../db";
import { TideDetail } from "../../generated/graphql";

export const getStationById = (id: string): NoaaStationEntity | undefined => {
  return noaaStations.find((tideStation) => tideStation.id === id);
};

export async function getTidePredictions(
  start: Date,
  end: Date,
  stationId: string
): Promise<TideDetail[]> {
  const pk = `noaa-predictions-${stationId}`;
  const data = await queryTimeSeriesData<TideData>(pk, start, end);
  return data.map((datum) => ({ ...datum, time: datum.timestamp }));
}

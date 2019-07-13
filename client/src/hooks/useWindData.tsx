import { useWindDataQuery, WindDataQuery } from "../generated/graphql";
import { noDecimals } from "./utils";
import { UseQueryState } from "urql";

export function useCurrentWindData(locationId: string) {
  const [result] = useWindDataQuery({ variables: { locationId } });
  const { curValue, curDirectionValue, curDetail } = extractData(result);

  return { curValue, curDirectionValue, curDetail, ...result };
}

function extractData(windData: UseQueryState<WindDataQuery>) {
  const curValue =
    windData.data &&
    windData.data.location &&
    windData.data.location.wind.summary.mostRecent &&
    noDecimals(windData.data.location.wind.summary.mostRecent.speed);

  const curDirectionValue =
    windData.data &&
    windData.data.location &&
    windData.data.location.wind.summary.mostRecent &&
    windData.data.location.wind.summary.mostRecent.direction;

  const curDetail =
    windData.data &&
    windData.data.location &&
    windData.data.location.wind &&
    windData.data.location.wind.detail &&
    windData.data.location.wind.detail.map(data => ({
      y: data.speed,
      x: data.timestamp,
      directionDegrees: data.directionDegrees,
      direction: data.direction
    }));

  return { curValue, curDirectionValue, curDetail };
}

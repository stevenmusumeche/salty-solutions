import {
  useCurrentConditionsDataQuery,
  CurrentConditionsDataQuery,
} from "../graphql";
import { noDecimals } from "./utils";
import { UseQueryState } from "urql";

interface Input {
  locationId: string;
  startDate: Date;
  endDate: Date;
  usgsSiteId?: string;
  noaaStationId?: string;
}
export function useCurrentWindData({
  locationId,
  startDate,
  endDate,
  usgsSiteId,
  noaaStationId,
}: Input) {
  const includeUsgs = !!usgsSiteId;
  const includeNoaa = !!noaaStationId;

  const [result, executeQuery] = useCurrentConditionsDataQuery({
    variables: {
      locationId,
      usgsSiteId,
      includeUsgs,
      noaaStationId,
      includeNoaa,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
  });

  const { curValue, curDirectionValue, curDetail } = extractData(result);

  return {
    curValue,
    curDirectionValue,
    curDetail,
    refresh: executeQuery,
    ...result,
  };
}

function extractData(windData: UseQueryState<CurrentConditionsDataQuery>) {
  // use either the USGS or the NOAA field, depending on which was requested
  const base =
    windData?.data?.usgsSite?.wind ||
    windData?.data?.tidePreditionStation?.wind;

  const curValue =
    base?.summary.mostRecent && noDecimals(base?.summary.mostRecent.speed);

  const curDirectionValue = base?.summary?.mostRecent?.direction;

  const curDetail =
    base?.detail &&
    base?.detail
      .map((data) => ({
        y: data.speed,
        x: data.timestamp,
        directionDegrees: data.directionDegrees,
        direction: data.direction,
      }))
      .sort((a, b) => {
        return new Date(a.x).getTime() - new Date(b.x).getTime();
      });

  return { curValue, curDirectionValue, curDetail };
}

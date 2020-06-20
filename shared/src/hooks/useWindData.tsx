import {
  useCurrentConditionsDataQuery,
  CurrentConditionsDataQuery,
} from "../graphql";
import { noDecimals } from "./utils";
import { UseQueryState } from "urql";

export function useCurrentWindData(
  locationId: string,
  startDate: Date,
  endDate: Date,
  usgsSiteId?: string
) {
  const [result, executeQuery] = useCurrentConditionsDataQuery({
    variables: {
      locationId,
      usgsSiteId,
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
  // not all locations have a valid USGS site for wind speed
  const base = windData?.data?.usgsSite?.wind || windData.data?.location?.wind;

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

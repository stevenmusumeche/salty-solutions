import {
  useCurrentConditionsDataQuery,
  CurrentConditionsDataQuery,
} from "../graphql";
import { UseQueryState, CombinedError } from "urql";
import { noDecimals } from "./utils";

export function useSalinityData(
  locationId: string,
  usgsSiteId: string,
  startDate: Date,
  endDate: Date
) {
  const [result, refresh] = useCurrentConditionsDataQuery({
    variables: {
      locationId,
      usgsSiteId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
  });
  const { curValue, curDetail, stationName } = extractData(result);
  return {
    curValue,
    curDetail,
    stationName,
    refresh,
    ...result,
    error:
      curValue === null
        ? new CombinedError({ graphQLErrors: ["no value"] })
        : result.error,
  };
}

function extractData(data: UseQueryState<CurrentConditionsDataQuery>) {
  const curValue =
    data.data &&
    data.data.usgsSite &&
    data.data.usgsSite.salinity &&
    data.data.usgsSite.salinity.summary &&
    data.data.usgsSite.salinity.summary.mostRecent
      ? noDecimals(data.data.usgsSite.salinity.summary.mostRecent.salinity)
      : null;

  const curDetail =
    data.data &&
    data.data.usgsSite &&
    data.data.usgsSite.salinity &&
    data.data.usgsSite.salinity.detail &&
    data.data.usgsSite.salinity.detail.map((data) => ({
      y: data.salinity,
      x: data.timestamp,
    }));

  const stationName =
    data.data && data.data.usgsSite && data.data.usgsSite.name;

  return { curValue, curDetail, stationName };
}

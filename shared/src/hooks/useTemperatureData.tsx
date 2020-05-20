import {
  useCurrentConditionsDataQuery,
  CurrentConditionsDataQuery,
} from "../graphql";
import { UseQueryState } from "urql";

export function useTemperatureData(
  locationId: string,
  startDate: Date,
  endDate: Date
) {
  const [result, refresh] = useCurrentConditionsDataQuery({
    variables: {
      locationId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
  });
  const { curValue, curDetail } = extractData(result);
  return { curValue, curDetail, refresh, ...result };
}

function extractData(data: UseQueryState<CurrentConditionsDataQuery>) {
  const curValue =
    data?.data?.location?.temperature?.summary?.mostRecent &&
    `${Math.round(
      data.data.location.temperature.summary.mostRecent.temperature.degrees
    )}°`;

  const curDetail = data?.data?.location?.temperature?.detail?.map((data) => ({
    y: data.temperature.degrees,
    x: data.timestamp,
  }));

  return { curValue, curDetail };
}

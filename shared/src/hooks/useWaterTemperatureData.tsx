import {
  useCurrentConditionsDataQuery,
  CurrentConditionsDataQuery,
} from "../graphql";
import { UseQueryState } from "urql";

export function useWaterTemperatureData(
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

  const { curValue, curDetail } = extractData(result);
  return { curValue, curDetail, refresh, ...result };
}

function extractData(data: UseQueryState<CurrentConditionsDataQuery>) {
  const curValue =
    data?.data?.usgsSite?.waterTemperature?.summary?.mostRecent &&
    `${Math.round(
      data.data.usgsSite.waterTemperature.summary.mostRecent.temperature.degrees
    )}°`;

  const curDetail = data?.data?.usgsSite?.waterTemperature?.detail?.map(
    (data) => ({
      y: data.temperature.degrees,
      x: data.timestamp,
    })
  );

  return { curValue, curDetail };
}

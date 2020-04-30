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
  const [result] = useCurrentConditionsDataQuery({
    variables: {
      locationId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
  });
  const { curValue, curDetail } = extractData(result);
  return { curValue, curDetail, ...result };
}

function extractData(data: UseQueryState<CurrentConditionsDataQuery>) {
  const curValue =
    data.data &&
    data.data.location &&
    data.data.location.temperature.summary.mostRecent &&
    `${Math.round(
      data.data.location.temperature.summary.mostRecent.temperature.degrees
    )}°`;

  const curDetail =
    data.data &&
    data.data.location &&
    data.data.location.temperature &&
    data.data.location.temperature.detail &&
    data.data.location.temperature.detail.map((data) => ({
      y: data.temperature.degrees,
      x: data.timestamp,
    }));

  return { curValue, curDetail };
}

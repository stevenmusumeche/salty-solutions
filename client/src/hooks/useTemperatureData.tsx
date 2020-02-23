import {
  useCurrentConditionsDataQuery,
  CurrentConditionsDataQuery
} from "../generated/graphql";
import { UseQueryState } from "urql";

export function useTemperatureData(locationId: string) {
  // todo
  const [result] = useCurrentConditionsDataQuery({
    variables: {
      locationId,
      usgsSiteId: "07381349",
      startDate: "2020-01-11",
      endDate: "2020-01-12"
    }
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
    data.data.location.temperature.detail.map(data => ({
      y: data.temperature.degrees,
      x: data.timestamp
    }));

  return { curValue, curDetail };
}

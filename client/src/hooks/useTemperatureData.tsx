import {
  useCurrentConditionsDataQuery,
  CurrentConditionsDataQuery
} from "../generated/graphql";
import { UseQueryState } from "urql";

export function useTemperatureData(locationId: string) {
  const [result] = useCurrentConditionsDataQuery({ variables: { locationId } });
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

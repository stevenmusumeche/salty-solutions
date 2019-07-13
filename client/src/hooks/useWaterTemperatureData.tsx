import {
  CurrentWaterTemperatureQuery,
  useCurrentWaterTemperatureQuery
} from "../generated/graphql";
import { UseQueryState } from "urql";

export function useWaterTemperatureData(locationId: string) {
  const [result] = useCurrentWaterTemperatureQuery({
    variables: { locationId }
  });

  const { curValue, curDetail } = extractData(result);
  return { curValue, curDetail, ...result };
}

function extractData(data: UseQueryState<CurrentWaterTemperatureQuery>) {
  const curValue =
    data.data &&
    data.data.location &&
    data.data.location.waterTemperature &&
    data.data.location.waterTemperature.summary &&
    data.data.location.waterTemperature.summary.mostRecent &&
    `${Math.round(
      data.data.location.waterTemperature.summary.mostRecent.temperature
    )}°`;

  const curDetail =
    data.data &&
    data.data.location &&
    data.data.location.waterTemperature &&
    data.data.location.waterTemperature.detail &&
    data.data.location.waterTemperature.detail.map(data => ({
      y: data.temperature,
      x: data.timestamp
    }));

  return { curValue, curDetail };
}

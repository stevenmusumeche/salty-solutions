import {
  useCurrentConditionsDataQuery,
  CurrentConditionsDataQuery,
} from "../graphql";
import { UseQueryState } from "urql";

interface Input {
  locationId: string;
  startDate: Date;
  endDate: Date;
  noaaStationId?: string;
}
export function useTemperatureData({
  locationId,
  startDate,
  endDate,
  noaaStationId,
}: Input) {
  const includeNoaa = !!noaaStationId;

  const [result, refresh] = useCurrentConditionsDataQuery({
    variables: {
      locationId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      noaaStationId,
      includeNoaa,
      includeUsgs: false,
    },
  });
  const { curValue, curDetail } = extractData(result);
  return { curValue, curDetail, refresh, ...result };
}

function extractData(data: UseQueryState<CurrentConditionsDataQuery>) {
  // use either the NOAA or location field, depending on which was requested
  const base =
    data?.data?.tidePreditionStation?.temperature ||
    data?.data?.location?.temperature;

  const curValue =
    base?.summary?.mostRecent &&
    `${Math.round(base.summary.mostRecent.temperature.degrees)}°`;

  const curDetail = base?.detail?.map((data) => ({
    y: data.temperature.degrees,
    x: data.timestamp,
  }));

  return { curValue, curDetail };
}

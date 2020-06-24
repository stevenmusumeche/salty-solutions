import {
  useCurrentConditionsDataQuery,
  CurrentConditionsDataQuery,
} from "../graphql";
import { UseQueryState } from "urql";

interface Input {
  locationId: string;
  startDate: Date;
  endDate: Date;
  usgsSiteId?: string;
  noaaStationId?: string;
}

export function useWaterTemperatureData({
  locationId,
  usgsSiteId,
  noaaStationId,
  startDate,
  endDate,
}: Input) {
  const includeUsgs = !!usgsSiteId;
  const includeNoaa = !!noaaStationId;

  const [result, refresh] = useCurrentConditionsDataQuery({
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

  const { curValue, curDetail } = extractData(result);
  return { curValue, curDetail, refresh, ...result };
}

function extractData(data: UseQueryState<CurrentConditionsDataQuery>) {
  // use either the USGS or the NOAA field, depending on which was requested
  const base =
    data?.data?.usgsSite?.waterTemperature ||
    data?.data?.tidePreditionStation?.waterTemperature;

  const curValue =
    base?.summary?.mostRecent &&
    `${Math.round(base.summary.mostRecent.temperature.degrees)}°`;

  const curDetail = base?.detail?.map((data) => ({
    y: data.temperature.degrees,
    x: data.timestamp,
  }));

  return { curValue, curDetail };
}

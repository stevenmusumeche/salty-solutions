import {
  useCurrentConditionsDataQuery,
  CurrentConditionsDataQuery
} from "../generated/graphql";
import { UseQueryState, CombinedError } from "urql";
import { noDecimals } from "./utils";

export function useSalinityData(locationId: string) {
  const [result] = useCurrentConditionsDataQuery({ variables: { locationId } });
  const { curValue, curDetail } = extractData(result);
  return {
    curValue,
    curDetail,
    ...result,
    error:
      curValue === null
        ? new CombinedError({ graphQLErrors: ["no value"] })
        : result.error
  };
}

function extractData(data: UseQueryState<CurrentConditionsDataQuery>) {
  const curValue =
    data.data &&
    data.data.location &&
    data.data.location.salinitySummary &&
    data.data.location.salinitySummary.summary &&
    data.data.location.salinitySummary.summary.mostRecent
      ? noDecimals(
          data.data.location.salinitySummary.summary.mostRecent.salinity
        )
      : null;

  const curDetail =
    data.data &&
    data.data.salinityDetail &&
    data.data.salinityDetail.salinity &&
    data.data.salinityDetail.salinity.detail &&
    data.data.salinityDetail.salinity.detail.map(data => ({
      y: data.salinity,
      x: data.timestamp
    }));

  return { curValue, curDetail };
}

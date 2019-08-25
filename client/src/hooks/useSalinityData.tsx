import { useSalinityQuery, SalinityQuery } from "../generated/graphql";
import { UseQueryState, CombinedError } from "urql";
import { noDecimals } from "./utils";

export function useSalinityData(locationId: string) {
  const [result] = useSalinityQuery({ variables: { locationId } });
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

function extractData(data: UseQueryState<SalinityQuery>) {
  const curValue =
    data.data &&
    data.data.location &&
    data.data.location.salinitySummary.summary &&
    data.data.location.salinitySummary.summary.mostRecent
      ? noDecimals(
          data.data.location.salinitySummary.summary.mostRecent.salinity
        )
      : null;

  const curDetail =
    data.data &&
    data.data.detail &&
    data.data.detail.salinityDetail &&
    data.data.detail.salinityDetail.detail &&
    data.data.detail.salinityDetail.detail.map(data => ({
      y: data.salinity,
      x: data.timestamp
    }));

  return { curValue, curDetail };
}

import { useSalinityQuery, SalinityQuery } from "../generated/graphql";
import { UseQueryState } from "urql";
import { noDecimals } from "./utils";

export function useSalinityData(locationId: string) {
  const [result] = useSalinityQuery({ variables: { locationId } });
  const { curValue, curDetail } = extractData(result);
  return { curValue, curDetail, ...result };
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
      : "?";

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

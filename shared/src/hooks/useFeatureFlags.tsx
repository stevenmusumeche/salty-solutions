import {
  FeatureFlagFieldsFragment,
  Platform,
  useFeatureFlagsQuery,
} from "../graphql";
import { useState, useEffect, useRef } from "react";
import useIsMounted from "./useIsMounted";
import useInterval from "./useInterval";

// list of available flags.  Only the keys matter.
const FLAGS = {
  "premium-enforcement-enabled": true,
};

/**
 * Available flags
 */
export type FLAG_ID = keyof typeof FLAGS;

type FlagMap = Map<FLAG_ID, FeatureFlagFieldsFragment>;

interface LoadingState {
  status: "loading";
}

interface ErrorState {
  status: "error";
  error: string;
}

interface LoadedState {
  status: "loaded";
  flags: FlagMap;
}

export type FeatureFlagsState = LoadingState | ErrorState | LoadedState;

export function useFeatureFlags(
  platform: Platform,
  pollInterval = 60000 * 60 // 60 mins
): FeatureFlagsState {
  const initialFetchComplete = useRef(false);
  const isMounted = useIsMounted();
  const [state, setState] = useState<FeatureFlagsState>({ status: "loading" });
  const [result, refetch] = useFeatureFlagsQuery({
    variables: { platform },
    requestPolicy: "network-only",
  });

  useInterval(
    () => {
      if (result.fetching) return;
      refetch({ requestPolicy: "network-only" });
    },
    isMounted() ? pollInterval : null
  );

  useEffect(() => {
    if (!isMounted()) return;

    if (result.fetching && initialFetchComplete.current === false) {
      setState({ status: "loading" });
    } else if (result.error && initialFetchComplete.current === false) {
      setState({ status: "error", error: result.error.message });
    } else if (result.data) {
      initialFetchComplete.current = true;
      setState({
        status: "loaded",
        flags: toMap(result.data.featureFlags.flags),
      });
    } else {
      setState({ status: "error", error: "No data" });
    }
  }, [result.fetching, result.error, result.data, refetch]);

  return state;
}

function toMap(flags: FeatureFlagFieldsFragment[]): FlagMap {
  return flags.reduce((acc: FlagMap, cur) => {
    acc.set(cur.id as FLAG_ID, cur);
    return acc;
  }, new Map());
}

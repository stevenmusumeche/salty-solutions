import { FeatureFlagFieldsFragment, Platform } from "../graphql";
import {
  useFeatureFlags,
  FeatureFlagsState,
  FLAG_ID,
} from "../hooks/useFeatureFlags";
import React, { createContext, FC, useContext, useMemo } from "react";

interface FeatureFlagState {
  state: FeatureFlagsState;
  getFlag(flagId: FLAG_ID): FeatureFlagFieldsFragment;
}

const FeatureFlagContext = createContext<FeatureFlagState>(
  undefined as unknown as FeatureFlagState
);

export const FeatureFlagProvider: FC<{ platform: Platform }> = ({
  children,
  platform,
}) => {
  const flagData = useFeatureFlags(platform);

  const context: FeatureFlagState = useMemo(
    () => ({
      state: flagData,
      getFlag: (flagId: FLAG_ID): FeatureFlagFieldsFragment => {
        if (flagData.status !== "loaded") {
          throw new Error("Cannot call get before data is loaded.");
        }
        return flagData.flags.get(flagId)!;
      },
    }),
    [flagData]
  );

  return (
    <FeatureFlagContext.Provider value={context}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlagContext = () => useContext(FeatureFlagContext);

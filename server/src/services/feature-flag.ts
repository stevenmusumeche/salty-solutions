import { FeatureFlag, Platform } from "../generated/graphql";
import { getItemByKey } from "./db";
import { PK, SK } from "./user";

// database has different values for each platform on each flag
type PlatformValue = Record<Platform, boolean>;
type FeatureFlagDAO = Omit<FeatureFlag, "__typename" | "value"> & {
  value: PlatformValue;
};
type FeatureFlagsDAO = { flags: FeatureFlagDAO[] };

export const getAllFlags = async (
  platform: Platform
): Promise<FeatureFlag[]> => {
  const flagConfig = await getItemByKey<FeatureFlagsDAO>({
    table: "user",
    pk: PK.appConfig(),
    sk: SK.featureFlags(),
  });

  if (!flagConfig) {
    throw new Error("Unable to load feature flags from database");
  }

  // use platform-specific value
  return flagConfig.flags.map((flag) => ({
    ...flag,
    value: flag.value[platform],
  }));
};

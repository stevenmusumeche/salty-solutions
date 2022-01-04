import gql from "graphql-tag";

const FEATURE_FLAGS_QUERY = gql`
  query FeatureFlags($platform: Platform!) {
    featureFlags(platform: $platform) {
      flags {
        ...FeatureFlagFields
      }
    }
  }

  fragment FeatureFlagFields on FeatureFlag {
    id
    type
    value
  }
`;

export default FEATURE_FLAGS_QUERY;

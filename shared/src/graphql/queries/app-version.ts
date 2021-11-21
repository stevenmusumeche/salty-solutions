import gql from "graphql-tag";

export const APP_VERSION_QUUERY = gql`
  query AppVersion {
    appVersion {
      ios {
        minimumSupported
        current
      }
      android {
        minimumSupported
        current
      }
    }
  }
`;

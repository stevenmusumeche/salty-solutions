import gql from "graphql-tag";

export const ADMIN_QUUERY = gql`
  query Admin {
    tidePreditionStations {
      ...TideStationDetail
      locations {
        id
        name
      }
    }
    usgsSites {
      ...UsgsSiteDetail
      locations {
        id
        name
      }
    }
  }
`;

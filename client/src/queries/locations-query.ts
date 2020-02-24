import gql from "graphql-tag";

const LOCATION_QUERY = gql`
  query Locations {
    locations {
      id
      name
      tidePreditionStations {
        ...TideStationDetail
      }
      usgsSites {
        ...UsgsSiteDetail
      }
    }
  }
  fragment TideStationDetail on TidePreditionStation {
    id
    name
  }

  fragment UsgsSiteDetail on UsgsSite {
    id
    name
    availableParams
  }
`;

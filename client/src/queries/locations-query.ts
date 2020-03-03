import gql from "graphql-tag";

const LOCATION_QUERY = gql`
  query Locations {
    locations {
      id
      name
      coords {
        lat
        lon
      }
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

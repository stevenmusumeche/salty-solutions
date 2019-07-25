import gql from "graphql-tag";

const LOCATION_QUERY = gql`
  query Locations {
    locations {
      id
      name
      tidePreditionStations {
        ...TideStationDetail
      }
    }
  }
  fragment TideStationDetail on TidePreditionStation {
    id
    name
  }
`;

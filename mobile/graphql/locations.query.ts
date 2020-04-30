import gql from 'graphql-tag';

export const LOCATION_QUERY = gql`
  query Locations {
    locations {
      ...LocationDetail
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

  fragment LocationDetail on Location {
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
`;

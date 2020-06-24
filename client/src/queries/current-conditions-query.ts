import gql from "graphql-tag";

const CURRENT_CONDITIONS_QUERY = gql`
  query CurrentConditionsData(
    $locationId: ID!
    $usgsSiteId: ID
    $includeUsgs: Boolean!
    $noaaStationId: ID
    $includeNoaa: Boolean!
    $startDate: String!
    $endDate: String!
  ) {
    location(id: $locationId) {
      id
      temperature {
        ...TemperatureDetailFields
      }
    }

    usgsSite(siteId: $usgsSiteId) @include(if: $includeUsgs) {
      ...UsgsSiteDetailFields
    }

    tidePreditionStation(stationId: $noaaStationId) @include(if: $includeNoaa) {
      ...TidePredictionStationDetailFields
    }
  }

  fragment TemperatureDetailFields on TemperatureResult {
    summary {
      mostRecent {
        temperature {
          degrees
        }
      }
    }
    detail(start: $startDate, end: $endDate) {
      timestamp
      temperature {
        degrees
      }
    }
  }

  fragment WaterTemperatureDetailFields on WaterTemperature {
    summary {
      mostRecent {
        temperature {
          degrees
        }
      }
    }
    detail(start: $startDate, end: $endDate) {
      timestamp
      temperature {
        degrees
      }
    }
  }

  fragment UsgsSiteDetailFields on UsgsSite {
    id
    name
    salinity {
      summary {
        mostRecent {
          salinity
        }
      }
      detail(start: $startDate, end: $endDate) {
        timestamp
        salinity
      }
    }
    waterTemperature {
      ...WaterTemperatureDetailFields
    }
    wind {
      summary {
        mostRecent {
          ...WindDetailFields2
        }
      }
      detail(start: $startDate, end: $endDate) {
        ...WindDetailFields2
      }
    }
  }

  fragment TidePredictionStationDetailFields on TidePreditionStation {
    id
    name
    wind {
      summary {
        mostRecent {
          ...WindDetailFields2
        }
      }
      detail(start: $startDate, end: $endDate) {
        ...WindDetailFields2
      }
    }
    temperature {
      ...TemperatureDetailFields
    }
    waterTemperature {
      ...WaterTemperatureDetailFields
    }
  }

  fragment WindDetailFields2 on WindDetail {
    timestamp
    speed
    direction
    directionDegrees
  }
`;

export default CURRENT_CONDITIONS_QUERY;

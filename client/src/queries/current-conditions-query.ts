import gql from "graphql-tag";

const CURRENT_CONDITIONS_QUERY = gql`
  query CurrentConditionsData(
    $locationId: ID!
    $usgsSiteId: ID
    $startDate: String!
    $endDate: String!
  ) {
    location(id: $locationId) {
      wind {
        summary {
          mostRecent {
            ...WindDetailFields2
          }
        }
        detail(numHours: 48) {
          ...WindDetailFields2
        }
      }

      temperature {
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

      waterTemperature {
        summary {
          mostRecent {
            timestamp
            temperature {
              degrees
            }
          }
        }
        detail(numHours: 48) {
          timestamp
          temperature {
            degrees
          }
        }
      }
    }

    usgsSite(siteId: $usgsSiteId) {
      ...UsgsSiteSalinityFields
    }
  }

  fragment UsgsSiteSalinityFields on UsgsSite {
    id
    name
    salinity(start: $startDate, end: $endDate) {
      summary {
        mostRecent {
          salinity
        }
      }
      detail {
        timestamp
        salinity
      }
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

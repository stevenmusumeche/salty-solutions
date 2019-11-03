import gql from "graphql-tag";

// todo: combine queries into a single one to reduce network calls
const CURRENT_CONDITIONS_QUERY = gql`
  query CurrentConditionsData($locationId: ID!) {
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
        detail(numHours: 48) {
          timestamp
          temperature {
            degrees
          }
        }
      }

      salinitySummary: salinity(numHours: 12) {
        summary {
          mostRecent {
            salinity
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

    salinityDetail: location(id: $locationId) {
      salinity(numHours: 48) {
        detail {
          timestamp
          salinity
        }
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

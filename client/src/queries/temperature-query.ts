import gql from "graphql-tag";

const TEMPERATURE_QUERY = gql`
  query CurrentTemperature($locationId: ID!) {
    location(id: $locationId) {
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
    }
  }
`;

export default TEMPERATURE_QUERY;

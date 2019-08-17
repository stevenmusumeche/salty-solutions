import gql from "graphql-tag";

const WATER_TEMPERATURE_QUERY = gql`
  query CurrentWaterTemperature($locationId: ID!) {
    location(id: $locationId) {
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
  }
`;

export default WATER_TEMPERATURE_QUERY;

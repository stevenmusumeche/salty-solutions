import gql from "graphql-tag";

const WATER_TEMPERATURE_QUERY = gql`
  query CurrentWaterTemperature {
    location(id: "2") {
      waterTemperature {
        summary {
          mostRecent {
            timestamp
            temperature
          }
        }
        detail(numHours: 72) {
          timestamp
          temperature
        }
      }
    }
  }
`;

export default WATER_TEMPERATURE_QUERY;

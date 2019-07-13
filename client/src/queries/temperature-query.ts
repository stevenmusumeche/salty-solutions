import gql from "graphql-tag";

const TEMPERATURE_QUERY = gql`
  query CurrentTemperature($locationId: ID!) {
    location(id: $locationId) {
      temperature {
        summary {
          mostRecent
        }
        detail(numHours: 48) {
          timestamp
          temperature
        }
      }
    }
  }
`;

export default TEMPERATURE_QUERY;

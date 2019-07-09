import gql from "graphql-tag";

const TEMPERATURE_QUERY = gql`
  query CurrentTemperature {
    location(id: "2") {
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

import gql from "graphql-tag";

const TEMPERATURE_QUERY = gql`
  query CurrentTemperature {
    location(id: "2") {
      temperature {
        summary {
          mostRecent
        }
      }
    }
  }
`;

export default TEMPERATURE_QUERY;

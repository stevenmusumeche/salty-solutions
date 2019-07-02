import gql from "graphql-tag";

const WIND_QUERY = gql`
  query WindData {
    location(id: "1") {
      wind {
        summary {
          mostRecent {
            ...WindDetailFields
          }
        }
        detail(numHours: 72) {
          ...WindDetailFields
        }
      }
    }
  }

  fragment WindDetailFields on WindDetail {
    timestamp
    speed
    direction
    directionDegrees
  }
`;

export default WIND_QUERY;

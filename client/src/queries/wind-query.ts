import gql from "graphql-tag";

const WIND_QUERY = gql`
  query WindData($locationId: ID!) {
    location(id: $locationId) {
      wind {
        summary {
          mostRecent {
            ...WindDetailFields
          }
        }
        detail(numHours: 48) {
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

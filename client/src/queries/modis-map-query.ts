import gql from "graphql-tag";

const MODIS_MAP_QUERY = gql`
  query ModisMap($locationId: ID!) {
    location(id: $locationId) {
      modisMaps(numDays: 7) {
        date
        small {
          url
          width
          height
        }
        large {
          url
          width
          height
        }
      }
    }
  }
`;

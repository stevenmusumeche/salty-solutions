import gql from "graphql-tag";

const SALINITY_MAP_QUERY = gql`
  query SalinityMap($locationId: ID!) {
    location(id: $locationId) {
      id
      salinityMap
    }
  }
`;

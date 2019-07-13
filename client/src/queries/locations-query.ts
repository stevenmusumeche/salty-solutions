import gql from "graphql-tag";

const LOCATION_QUERY = gql`
  query Locations {
    locations {
      id
      name
    }
  }
`;

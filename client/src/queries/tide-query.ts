import gql from "graphql-tag";

const TIDE_QUERY = gql`
  query Tide($stationId: ID!, $startDate: String!, $endDate: String!) {
    tidePreditionStation(stationId: $stationId) {
      tides(start: $startDate, end: $endDate) {
        time
        height
        type
      }
    }
  }
`;

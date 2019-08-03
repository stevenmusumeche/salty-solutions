import gql from "graphql-tag";

const TIDE_QUERY = gql`
  query Tide(
    $locationId: ID!
    $stationId: ID!
    $startDate: String!
    $endDate: String!
  ) {
    tidePreditionStation(stationId: $stationId) {
      tides(start: $startDate, end: $endDate) {
        ...TideDetailFields
      }
    }
    location(id: $locationId) {
      sun(start: $startDate, end: $endDate) {
        ...SunDetailFields
      }
    }
  }
  fragment TideDetailFields on TideDetail {
    time
    height
    type
  }

  fragment SunDetailFields on SunDetail {
    sunrise
    sunset
    dawn
    dusk
    nauticalDawn
    nauticalDusk
  }
`;

import gql from "graphql-tag";

const SUN_AND_MOON_QUERY = gql`
  query SunAndMoon($locationId: ID!, $startDate: String!, $endDate: String!) {
    location(id: $locationId) {
      sun(start: $startDate, end: $endDate) {
        sunrise
        sunset
        nauticalDawn
        nauticalDusk
      }
      moon(start: $startDate, end: $endDate) {
        phase
        illumination
      }
    }
  }
`;

import gql from "graphql-tag";

const TIDE_QUERY = gql`
  query Tide(
    $locationId: ID!
    $tideStationId: ID!
    $usgsSiteId: ID!
    $startDate: String!
    $endDate: String!
  ) {
    tidePreditionStation(stationId: $tideStationId) {
      tides(start: $startDate, end: $endDate) {
        ...TideDetailFields
      }
    }
    usgsSite(siteId: $usgsSiteId) {
      ...UsgsSiteFields
    }
    location(id: $locationId) {
      sun(start: $startDate, end: $endDate) {
        ...SunDetailFields
      }
      moon(start: $startDate, end: $endDate) {
        ...MoonDetailFields
      }
    }
  }

  fragment TideDetailFields on TideDetail {
    time
    height
    type
  }

  fragment UsgsSiteFields on UsgsSite {
    id
    name
    waterHeight(start: $startDate, end: $endDate) {
      ...WaterHeightFields
    }
  }

  fragment WaterHeightFields on WaterHeight {
    timestamp
    height
  }

  fragment SunDetailFields on SunDetail {
    sunrise
    sunset
    dawn
    dusk
    nauticalDawn
    nauticalDusk
  }

  fragment MoonDetailFields on MoonDetail {
    date
    phase
    illumination
  }
`;

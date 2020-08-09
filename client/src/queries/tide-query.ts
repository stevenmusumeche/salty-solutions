import gql from "graphql-tag";

const TIDE_QUERY = gql`
  query Tide(
    $locationId: ID!
    $tideStationId: ID!
    $usgsSiteId: ID
    $includeUsgs: Boolean!
    $noaaStationId: ID
    $includeNoaa: Boolean!
    $startDate: String!
    $endDate: String!
  ) {
    tidePreditionStation(stationId: $tideStationId) {
      id
      tides(start: $startDate, end: $endDate) {
        ...TideDetailFields
      }
    }
    usgsSite(siteId: $usgsSiteId) @include(if: $includeUsgs) {
      ...UsgsSiteFields
    }
    noaaWaterHeight: tidePreditionStation(stationId: $noaaStationId)
      @include(if: $includeNoaa) {
      waterHeight(start: $startDate, end: $endDate) {
        ...WaterHeightFields
      }
    }
    location(id: $locationId) {
      id
      sun(start: $startDate, end: $endDate) {
        ...SunDetailFields
      }
      moon(start: $startDate, end: $endDate) {
        ...MoonDetailFields
      }
      solunar(start: $startDate, end: $endDate) {
        ...SolunarDetailFields
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

  fragment SolunarDetailFields on SolunarDetail {
    date
    score
    majorPeriods {
      ...SolunarPeriodFields
    }
    minorPeriods {
      ...SolunarPeriodFields
    }
  }

  fragment SolunarPeriodFields on SolunarPeriod {
    start
    end
    weight
  }
`;

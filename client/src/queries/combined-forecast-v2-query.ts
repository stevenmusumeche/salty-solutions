import gql from "graphql-tag";

export const COMBINED_FORECAST_V2_QUERY = gql`
  query CombinedForecastV2(
    $locationId: ID!
    $startDate: String!
    $endDate: String!
  ) {
    location(id: $locationId) {
      id
      combinedForecastV2(start: $startDate, end: $endDate) {
        ...CombinedForecastV2Detail
      }
      tidePreditionStations(limit: 1) {
        id
        name
        tides(start: $startDate, end: $endDate) {
          ...TideDetailFields
        }
      }
      sun(start: $startDate, end: $endDate) {
        ...SunDetailFields
      }
    }
  }

  fragment CombinedForecastV2Detail on CombinedForecastV2 {
    name
    date
    wind {
      timestamp
      base
      gusts
      direction {
        text
        degrees
      }
    }
    day {
      short
      detailed
      marine
    }
    night {
      short
      detailed
      marine
    }
    temperature {
      timestamp
      temperature {
        degrees
      }
    }
    rain {
      timestamp
      mmPerHour
    }
  }
`;

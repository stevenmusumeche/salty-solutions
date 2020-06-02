import gql from "graphql-tag";

export const COMBINED_FORECAST_V2_QUERY = gql`
  query CombinedForecastV2($locationId: ID!) {
    location(id: $locationId) {
      combinedForecastV2 {
        ...CombinedForecastV2Detail
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
    }
    night {
      short
      detailed
    }
  }
`;

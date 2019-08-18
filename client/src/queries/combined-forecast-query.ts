import gql from "graphql-tag";

export const COMBINED_FORECAST_QUERY = gql`
  query CombinedForecast($locationId: ID!) {
    location(id: $locationId) {
      combinedForecast {
        timePeriod
        wind {
          speed {
            from
            to
          }
          direction {
            text
            degrees
          }
        }
        waterCondition {
          text
          icon
        }
        temperature {
          degrees
          unit
        }
        chanceOfPrecipitation
        icon
        marine
        short
        detailed
      }
    }
  }
`;

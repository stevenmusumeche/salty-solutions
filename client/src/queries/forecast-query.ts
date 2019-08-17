import gql from "graphql-tag";

const FORECAST_QUERY = gql`
  query Forecast($locationId: ID!) {
    location(id: $locationId) {
      marineForecast {
        timePeriod
        forecast {
          text
        }
      }
      weatherForecast {
        name
        temperature {
          degrees
          unit
        }
        windSpeed {
          to
          from
        }
        windDirection {
          text
        }
        icon
        shortForecast
        detailedForecast
      }
    }
  }
`;

import gql from "graphql-tag";

export const HOURLY_FORECAST_QUERY = gql`
  query HourlyForecast($locationId: ID!) {
    location(id: $locationId) {
      hourlyWeatherForecast {
        ...HourlyForecastDetail
      }
    }
  }

  fragment HourlyForecastDetail on WeatherForecast {
    startTime
    temperature {
      degrees
      unit
    }
    windSpeed {
      from
      to
    }
    windDirection {
      text
    }
    icon
    shortForecast
  }
`;

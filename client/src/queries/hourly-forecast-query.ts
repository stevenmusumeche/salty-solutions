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
    temperature
    temperatureUnit
    windSpeed
    windDirection
    icon
    shortForecast
  }
`;

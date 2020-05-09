import gql from "graphql-tag";

export const COMBINED_FORECAST_QUERY = gql`
  query CombinedForecast($locationId: ID!) {
    location(id: $locationId) {
      combinedForecast {
        ...CombinedForecastDetail
      }

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

  fragment CombinedForecastDetail on CombinedForecast {
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
`;

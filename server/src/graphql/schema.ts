import { gql } from "apollo-server-koa";

export default gql`
  type Query {
    locations: [Location!]!
    location(id: ID!): Location
    tidePreditionStation(stationId: ID!): TidePreditionStation
  }

  type Location {
    id: ID!
    name: String!
    tidePreditionStations: [TidePreditionStation!]!
    lat: Float!
    long: Float!
    sun(start: String!, end: String!): [SunDetail!]
    moon(start: String!, end: String!): [MoonDetail!]
    forecast: [Forecast!]!
    weatherForecast: [WeatherForecast!]
    hourlyWeatherForecast: [WeatherForecast!]
    marineForecast: [MarineForecast!]
    waterHeight(numDays: Int): [WaterHeight!]
    waterTemperature(numDays: Int): WaterTemperature!
    wind: Wind!
    salinity(numHours: Int): Salinity!
    temperature: Temperature!
    maps: Maps
  }

  type Forecast {
    timePeriod: String!
    weather: WeatherForecast
    marine: MarineForecastDetail
  }

  type Maps {
    radar(numImages: Int): [Map!]!
    overlays: Overlays!
  }

  type Overlays {
    topo: String!
    counties: String!
    rivers: String!
    highways: String!
    cities: String!
  }

  type Map {
    imageUrl: String!
    timestamp: String!
  }

  type Temperature {
    summary: TemperatureSummary!
    detail(numHours: Int): [TemperatureDetail!]
  }

  type TemperatureSummary {
    mostRecent: Float!
  }

  type TidePreditionStation {
    id: ID!
    name: String!
    url: String!
    lat: Float!
    long: Float!
    tides(start: String!, end: String!): [TideDetail!]
  }

  type TideDetail {
    time: String!
    height: Float!
    type: String!
  }

  type SunDetail {
    date: String!
    sunrise: String!
    sunset: String!
    dawn: String!
    dusk: String!
    nauticalDawn: String!
    nauticalDusk: String!
  }

  type MoonDetail {
    date: String!
    phase: String!
    illumination: Int!
  }

  type WeatherForecast {
    name: String!
    startTime: String!
    endTime: String!
    isDaytime: Boolean!
    temperature: Int!
    temperatureUnit: String!
    windSpeed: String
    windDirection: String
    icon: String!
    shortForecast: String!
    detailedForecast: String!
  }

  type MarineForecast {
    timePeriod: String!
    forecast: MarineForecastDetail!
  }

  type MarineForecastDetail {
    text: String!
    waterCondition: String
    windSpeed: MarineForecastWindSpeedDetail
    windDirection: WindDirection
  }

  type WindDirection {
    text: String!
    degrees: Int!
  }

  type MarineForecastWindSpeedDetail {
    from: Int!
    to: Int!
  }

  type WaterHeight {
    timestamp: String!
    "measured in feet"
    height: Float!
  }

  type WaterTemperature {
    summary: WaterTemperatureSummary!
    detail(numHours: Int): [TemperatureDetail!]
  }

  type WaterTemperatureSummary {
    mostRecent: TemperatureDetail
  }

  type TemperatureDetail {
    timestamp: String!
    "fahrenheit"
    temperature: Float!
  }

  type WindDetail {
    timestamp: String!
    "miles per hour"
    speed: Float!
    direction: String!
    directionDegrees: Float!
  }

  type Wind {
    summary: WindSummary!
    detail(numHours: Int): [WindDetail!]
  }

  type WindSummary {
    mostRecent: WindDetail
  }

  type CurrentWind {
    speed: Float!
    direction: String!
    directionDegrees: Float!
  }

  type Salinity {
    summary: SalinitySummary
    detail: [SalinityDetail!]
  }

  type SalinitySummary {
    "parts per thousand"
    mostRecent: SalinityDetail
  }

  type SalinityDetail {
    timestamp: String!
    "parts per thousand"
    salinity: Float!
  }
`;

import { gql } from "apollo-server-koa";

export default gql`
  type Query {
    locations: [Location!]!
    location(id: ID!): Location
    tidePreditionStation(stationId: ID!): TidePreditionStation
    usgsSite(siteId: ID): UsgsSite
  }

  type Location {
    id: ID!
    name: String!
    tidePreditionStations: [TidePreditionStation!]!
    usgsSites: [UsgsSite!]!
    coords: Coords!
    sun(start: String!, end: String!): [SunDetail!]
    moon(start: String!, end: String!): [MoonDetail!]
    combinedForecast: [CombinedForecast!]
    weatherForecast: [WeatherForecast!]
    hourlyWeatherForecast: [WeatherForecast!]
    marineForecast: [MarineForecast!]
    wind: Wind
    temperature: TemperatureResult!
    maps: Maps
    dataSources: DataSources
    modisMaps(numDays: Int): [ModisMap!]!
    salinityMap: String!
  }

  type UsgsSite {
    id: ID!
    name: String!
    coords: Coords!
    waterHeight(start: String!, end: String!): [WaterHeight!]
    waterTemperature: WaterTemperature
    salinity(start: String!, end: String!): Salinity
    availableParams: [UsgsParam!]!
  }

  type ModisMap {
    date: String!
    satellite: ModisSatellite!
    small: ModisMapEntry!
    medium: ModisMapEntry!
    large: ModisMapEntry!
  }

  enum ModisSatellite {
    TERRA
    AQUA
  }

  type ModisMapEntry {
    url: String!
    width: Int!
    height: Int!
  }

  type DataSources {
    tideStationIds: [String!]!
    marineZoneId: String!
    usgsSiteId: String!
    weatherStationId: String!
    weatherRadarSiteId: String!
  }

  type CombinedForecast {
    timePeriod: String!
    wind: WindForecast!
    waterCondition: WaterCondition
    temperature: Temperature!
    marine: String
    short: String!
    detailed: String!
    chanceOfPrecipitation: Int
    icon: String!
  }

  type WaterCondition {
    text: String!
    icon: String!
  }

  type WindForecast {
    speed: ForecastWindSpeedDetail
    direction: WindDirection
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

  type TemperatureResult {
    summary: TemperatureSummary!
    detail(start: String!, end: String!): [TemperatureDetail!]
  }

  type TemperatureSummary {
    mostRecent: TemperatureDetail!
  }

  type Coords {
    lat: Float!
    lon: Float!
  }

  type TidePreditionStation {
    id: ID!
    name: String!
    url: String!
    # todo move to Coords type
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
    temperature: Temperature!
    windSpeed: ForecastWindSpeedDetail
    windDirection: WindDirection
    icon: String!
    shortForecast: String!
    detailedForecast: String!
    chanceOfPrecipitation: Int
  }

  type Temperature {
    degrees: Float!
    unit: String!
  }

  type MarineForecast {
    timePeriod: String!
    forecast: MarineForecastDetail!
  }

  type MarineForecastDetail {
    text: String!
    waterCondition: String
    windSpeed: ForecastWindSpeedDetail
    windDirection: WindDirection
  }

  type WindDirection {
    text: String!
    degrees: Int!
  }

  type ForecastWindSpeedDetail {
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
    detail(start: String!, end: String!): [TemperatureDetail!]
  }

  type WaterTemperatureSummary {
    mostRecent: TemperatureDetail
  }

  type TemperatureDetail {
    timestamp: String!
    temperature: Temperature!
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
    detail(start: String!, end: String!): [WindDetail!]
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

  enum UsgsParam {
    WaterTemp
    WindSpeed
    WindDirection
    GuageHeight
    Salinity
  }
`;

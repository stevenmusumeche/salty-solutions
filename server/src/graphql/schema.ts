import { gql } from "apollo-server-koa";

export default gql`
  type Query {
    locations: [Location!]!
    location(id: ID!): Location
    tidePreditionStation(stationId: ID): TidePreditionStation
    tidePreditionStations: [TidePreditionStation!]!
    usgsSite(siteId: ID): UsgsSite
    usgsSites: [UsgsSite!]!
    appVersion: AppVersion!
    viewer: User
  }

  type Mutation {
    userLoggedIn(input: UserLoggedInInput!): UserLoggedInResponse!
  }

  type User {
    id: ID!
    email: String!
    name: String!
    picture: String
    createdAt: String!
    purchases: [UserPurchase!]!
  }

  type UserPurchase {
    id: ID!
    item: PurchasableItem!
    priceCents: Int!
    platform: Platform!
    isActive: Boolean!
    purchaseDate: String!
    endDate: String
  }

  enum PurchasableItem {
    PREMIUM_V1
  }

  enum Platform {
    WEB
    IOS
    ANDROID
  }

  input UserLoggedInInput {
    platform: Platform!
  }

  type UserLoggedInResponse {
    user: User!
  }

  type AppVersion {
    ios: SupportedVersion!
    android: SupportedVersion!
  }

  type SupportedVersion {
    minimumSupported: String!
    current: String!
  }

  type Location {
    id: ID!
    name: String!
    state: String!
    tidePreditionStations(limit: Int): [TidePreditionStation!]!
    usgsSites: [UsgsSite!]!
    coords: Coords!
    sun(start: String!, end: String!): [SunDetail!]
    moon(start: String!, end: String!): [MoonDetail!]
    solunar(start: String!, end: String!): [SolunarDetail!]
    combinedForecastV2(start: String!, end: String!): [CombinedForecastV2!]
    weatherForecast: [WeatherForecast!]
    hourlyWeatherForecast: [WeatherForecast!]
    marineForecast: [MarineForecast!]
    wind: Wind
    temperature: TemperatureResult!
    dataSources: DataSources
    modisMaps(numDays: Int): [ModisMap!]!
    salinityMap: String!
  }

  type UsgsSite {
    id: ID!
    url: String!
    name: String!
    coords: Coords!
    waterHeight(start: String!, end: String!): [WaterHeight!]
    waterTemperature: WaterTemperature
    wind: Wind
    salinity: Salinity
    availableParams: [UsgsParam!]!
    availableParamsV2: [UsgsParamInfo!]!
    locations: [Location!]!
  }

  type UsgsParamInfo {
    id: UsgsParam!
    latestDataDate: String
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
    weatherRadarSiteId: String! # deprecated
  }

  type CombinedForecastV2 {
    date: String!
    name: String!
    wind: [ForecastWindDetailV2!]!
    waves: [ForecastWaveDetail!]!
    temperature: [TemperatureDetail!]!
    day: ForecastDescription!
    night: ForecastDescription!
    rain: [RainDetail!]!
  }

  type ForecastDescription {
    short: String
    detailed: String
    marine: String
  }

  type TemperatureResult {
    summary: TemperatureSummary!
    detail(start: String!, end: String!): [TemperatureDetail!]
  }

  type TemperatureSummary {
    mostRecent: TemperatureDetail
  }

  type Coords {
    lat: Float!
    lon: Float!
  }

  type TidePreditionStation {
    id: ID!
    name: String!
    url: String!
    coords: Coords!
    tides(start: String!, end: String!): [TideDetail!]
    availableParams: [NoaaParam!]!
    availableParamsV2: [NoaaParamInfo!]!
    wind: Wind
    temperature: TemperatureResult
    waterTemperature: WaterTemperature
    salinity: Salinity
    waterHeight(start: String!, end: String!): [WaterHeight!]
    locations: [Location!]!
  }

  type NoaaParamInfo {
    id: NoaaParam!
    latestDataDate: String
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

  type SolunarDetail {
    date: String!
    score: Float!
    saltyScore: Int!
    majorPeriods: [SolunarPeriod!]!
    minorPeriods: [SolunarPeriod!]!
  }

  type SolunarPeriod {
    start: String!
    end: String!
    weight: Int!
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
    timePeriod: MarineForecastTimePeriod!
    forecast: MarineForecastDetail!
  }

  type MarineForecastTimePeriod {
    text: String!
    date: String!
    isDaytime: Boolean!
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

  type ForecastWindDetailV2 {
    timestamp: String!
    "mph"
    base: Float!
    "mph"
    gusts: Float!
    direction: WindDirection!
  }

  type ForecastWaveDetail {
    timestamp: String!
    "feet"
    height: Float!
    direction: WindDirection!
  }

  type RainDetail {
    timestamp: String!
    mmPerHour: Float!
  }

  type WaterHeight {
    timestamp: String!
    "measured in feet"
    height: Float!
  }

  type WaterTemperature {
    summary: TemperatureSummary!
    detail(start: String!, end: String!): [TemperatureDetail!]
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
    detail(start: String!, end: String!): [SalinityDetail!]
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

  enum NoaaParam {
    Wind
    WaterLevel
    AirTemperature
    WaterTemperature
    AirPressure
    TidePrediction
  }

  # not used yet
  type AirPressure {
    timestamp: String!
    # millibars
    pressure: Float!
  }
`;

import { GraphQLResolveInfo } from 'graphql';
import { LocationEntity } from '../services/location';
import { TideStationEntity } from '../services/tide';
import { UsgsSiteEntity } from '../services/usgs';
import { Context } from '../server';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type CombinedForecast = {
  __typename?: 'CombinedForecast',
  timePeriod: Scalars['String'],
  wind: WindForecast,
  waterCondition?: Maybe<WaterCondition>,
  temperature: Temperature,
  marine?: Maybe<Scalars['String']>,
  short: Scalars['String'],
  detailed: Scalars['String'],
  chanceOfPrecipitation?: Maybe<Scalars['Int']>,
  icon: Scalars['String'],
};

export type CombinedForecastV2 = {
  __typename?: 'CombinedForecastV2',
  date: Scalars['String'],
  name: Scalars['String'],
  wind: Array<ForecastWindDetailV2>,
  waves: Array<ForecastWaveDetail>,
  temperature: Array<TemperatureDetail>,
  day: ForecastDescription,
  night: ForecastDescription,
  rain: Array<RainDetail>,
};

export type Coords = {
  __typename?: 'Coords',
  lat: Scalars['Float'],
  lon: Scalars['Float'],
};

export type CurrentWind = {
  __typename?: 'CurrentWind',
  speed: Scalars['Float'],
  direction: Scalars['String'],
  directionDegrees: Scalars['Float'],
};

export type DataSources = {
  __typename?: 'DataSources',
  tideStationIds: Array<Scalars['String']>,
  marineZoneId: Scalars['String'],
  usgsSiteId: Scalars['String'],
  weatherStationId: Scalars['String'],
  weatherRadarSiteId: Scalars['String'],
};

export type ForecastDescription = {
  __typename?: 'ForecastDescription',
  short?: Maybe<Scalars['String']>,
  detailed?: Maybe<Scalars['String']>,
};

export type ForecastWaveDetail = {
  __typename?: 'ForecastWaveDetail',
  timestamp: Scalars['String'],
  /** feet */
  height: Scalars['Float'],
  direction: WindDirection,
};

export type ForecastWindDetailV2 = {
  __typename?: 'ForecastWindDetailV2',
  timestamp: Scalars['String'],
  /** mph */
  base: Scalars['Float'],
  /** mph */
  gusts: Scalars['Float'],
  direction: WindDirection,
};

export type ForecastWindSpeedDetail = {
  __typename?: 'ForecastWindSpeedDetail',
  from: Scalars['Int'],
  to: Scalars['Int'],
};

export type Location = {
  __typename?: 'Location',
  id: Scalars['ID'],
  name: Scalars['String'],
  tidePreditionStations: Array<TidePreditionStation>,
  usgsSites: Array<UsgsSite>,
  coords: Coords,
  sun?: Maybe<Array<SunDetail>>,
  moon?: Maybe<Array<MoonDetail>>,
  combinedForecast?: Maybe<Array<CombinedForecast>>,
  combinedForecastV2?: Maybe<Array<CombinedForecastV2>>,
  weatherForecast?: Maybe<Array<WeatherForecast>>,
  hourlyWeatherForecast?: Maybe<Array<WeatherForecast>>,
  marineForecast?: Maybe<Array<MarineForecast>>,
  wind?: Maybe<Wind>,
  temperature: TemperatureResult,
  maps?: Maybe<Maps>,
  dataSources?: Maybe<DataSources>,
  modisMaps: Array<ModisMap>,
  salinityMap: Scalars['String'],
};


export type LocationSunArgs = {
  start: Scalars['String'],
  end: Scalars['String']
};


export type LocationMoonArgs = {
  start: Scalars['String'],
  end: Scalars['String']
};


export type LocationCombinedForecastV2Args = {
  start: Scalars['String'],
  end: Scalars['String']
};


export type LocationModisMapsArgs = {
  numDays?: Maybe<Scalars['Int']>
};

export type Map = {
  __typename?: 'Map',
  imageUrl: Scalars['String'],
  timestamp: Scalars['String'],
};

export type Maps = {
  __typename?: 'Maps',
  radar: Array<Map>,
  overlays: Overlays,
};


export type MapsRadarArgs = {
  numImages?: Maybe<Scalars['Int']>
};

export type MarineForecast = {
  __typename?: 'MarineForecast',
  timePeriod: Scalars['String'],
  forecast: MarineForecastDetail,
};

export type MarineForecastDetail = {
  __typename?: 'MarineForecastDetail',
  text: Scalars['String'],
  waterCondition?: Maybe<Scalars['String']>,
  windSpeed?: Maybe<ForecastWindSpeedDetail>,
  windDirection?: Maybe<WindDirection>,
};

export type ModisMap = {
  __typename?: 'ModisMap',
  date: Scalars['String'],
  satellite: ModisSatellite,
  small: ModisMapEntry,
  medium: ModisMapEntry,
  large: ModisMapEntry,
};

export type ModisMapEntry = {
  __typename?: 'ModisMapEntry',
  url: Scalars['String'],
  width: Scalars['Int'],
  height: Scalars['Int'],
};

export enum ModisSatellite {
  Terra = 'TERRA',
  Aqua = 'AQUA'
}

export type MoonDetail = {
  __typename?: 'MoonDetail',
  date: Scalars['String'],
  phase: Scalars['String'],
  illumination: Scalars['Int'],
};

export type Overlays = {
  __typename?: 'Overlays',
  topo: Scalars['String'],
  counties: Scalars['String'],
  rivers: Scalars['String'],
  highways: Scalars['String'],
  cities: Scalars['String'],
};

export type Query = {
  __typename?: 'Query',
  locations: Array<Location>,
  location?: Maybe<Location>,
  tidePreditionStation?: Maybe<TidePreditionStation>,
  usgsSite?: Maybe<UsgsSite>,
};


export type QueryLocationArgs = {
  id: Scalars['ID']
};


export type QueryTidePreditionStationArgs = {
  stationId: Scalars['ID']
};


export type QueryUsgsSiteArgs = {
  siteId?: Maybe<Scalars['ID']>
};

export type RainDetail = {
  __typename?: 'RainDetail',
  timestamp: Scalars['String'],
  mmPerHour: Scalars['Float'],
};

export type Salinity = {
  __typename?: 'Salinity',
  summary?: Maybe<SalinitySummary>,
  detail?: Maybe<Array<SalinityDetail>>,
};

export type SalinityDetail = {
  __typename?: 'SalinityDetail',
  timestamp: Scalars['String'],
  /** parts per thousand */
  salinity: Scalars['Float'],
};

export type SalinitySummary = {
  __typename?: 'SalinitySummary',
  /** parts per thousand */
  mostRecent?: Maybe<SalinityDetail>,
};

export type SunDetail = {
  __typename?: 'SunDetail',
  date: Scalars['String'],
  sunrise: Scalars['String'],
  sunset: Scalars['String'],
  dawn: Scalars['String'],
  dusk: Scalars['String'],
  nauticalDawn: Scalars['String'],
  nauticalDusk: Scalars['String'],
};

export type Temperature = {
  __typename?: 'Temperature',
  degrees: Scalars['Float'],
  unit: Scalars['String'],
};

export type TemperatureDetail = {
  __typename?: 'TemperatureDetail',
  timestamp: Scalars['String'],
  temperature: Temperature,
};

export type TemperatureResult = {
  __typename?: 'TemperatureResult',
  summary: TemperatureSummary,
  detail?: Maybe<Array<TemperatureDetail>>,
};


export type TemperatureResultDetailArgs = {
  start: Scalars['String'],
  end: Scalars['String']
};

export type TemperatureSummary = {
  __typename?: 'TemperatureSummary',
  mostRecent: TemperatureDetail,
};

export type TideDetail = {
  __typename?: 'TideDetail',
  time: Scalars['String'],
  height: Scalars['Float'],
  type: Scalars['String'],
};

export type TidePreditionStation = {
  __typename?: 'TidePreditionStation',
  id: Scalars['ID'],
  name: Scalars['String'],
  url: Scalars['String'],
  /** todo move to Coords type */
  lat: Scalars['Float'],
  long: Scalars['Float'],
  tides?: Maybe<Array<TideDetail>>,
};


export type TidePreditionStationTidesArgs = {
  start: Scalars['String'],
  end: Scalars['String']
};

export enum UsgsParam {
  WaterTemp = 'WaterTemp',
  WindSpeed = 'WindSpeed',
  WindDirection = 'WindDirection',
  GuageHeight = 'GuageHeight',
  Salinity = 'Salinity'
}

export type UsgsSite = {
  __typename?: 'UsgsSite',
  id: Scalars['ID'],
  name: Scalars['String'],
  coords: Coords,
  waterHeight?: Maybe<Array<WaterHeight>>,
  waterTemperature?: Maybe<WaterTemperature>,
  salinity?: Maybe<Salinity>,
  availableParams: Array<UsgsParam>,
};


export type UsgsSiteWaterHeightArgs = {
  start: Scalars['String'],
  end: Scalars['String']
};


export type UsgsSiteSalinityArgs = {
  start: Scalars['String'],
  end: Scalars['String']
};

export type WaterCondition = {
  __typename?: 'WaterCondition',
  text: Scalars['String'],
  icon: Scalars['String'],
};

export type WaterHeight = {
  __typename?: 'WaterHeight',
  timestamp: Scalars['String'],
  /** measured in feet */
  height: Scalars['Float'],
};

export type WaterTemperature = {
  __typename?: 'WaterTemperature',
  summary: WaterTemperatureSummary,
  detail?: Maybe<Array<TemperatureDetail>>,
};


export type WaterTemperatureDetailArgs = {
  start: Scalars['String'],
  end: Scalars['String']
};

export type WaterTemperatureSummary = {
  __typename?: 'WaterTemperatureSummary',
  mostRecent?: Maybe<TemperatureDetail>,
};

export type WeatherForecast = {
  __typename?: 'WeatherForecast',
  name: Scalars['String'],
  startTime: Scalars['String'],
  endTime: Scalars['String'],
  isDaytime: Scalars['Boolean'],
  temperature: Temperature,
  windSpeed?: Maybe<ForecastWindSpeedDetail>,
  windDirection?: Maybe<WindDirection>,
  icon: Scalars['String'],
  shortForecast: Scalars['String'],
  detailedForecast: Scalars['String'],
  chanceOfPrecipitation?: Maybe<Scalars['Int']>,
};

export type Wind = {
  __typename?: 'Wind',
  summary: WindSummary,
  detail?: Maybe<Array<WindDetail>>,
};


export type WindDetailArgs = {
  start: Scalars['String'],
  end: Scalars['String']
};

export type WindDetail = {
  __typename?: 'WindDetail',
  timestamp: Scalars['String'],
  /** miles per hour */
  speed: Scalars['Float'],
  direction: Scalars['String'],
  directionDegrees: Scalars['Float'],
};

export type WindDirection = {
  __typename?: 'WindDirection',
  text: Scalars['String'],
  degrees: Scalars['Int'],
};

export type WindForecast = {
  __typename?: 'WindForecast',
  speed?: Maybe<ForecastWindSpeedDetail>,
  direction?: Maybe<WindDirection>,
};

export type WindSummary = {
  __typename?: 'WindSummary',
  mostRecent?: Maybe<WindDetail>,
};



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>;
}

export type SubscriptionResolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  Location: ResolverTypeWrapper<LocationEntity>,
  ID: ResolverTypeWrapper<Partial<Scalars['ID']>>,
  String: ResolverTypeWrapper<Partial<Scalars['String']>>,
  TidePreditionStation: ResolverTypeWrapper<TideStationEntity>,
  Float: ResolverTypeWrapper<Partial<Scalars['Float']>>,
  TideDetail: ResolverTypeWrapper<Partial<TideDetail>>,
  UsgsSite: ResolverTypeWrapper<UsgsSiteEntity>,
  Coords: ResolverTypeWrapper<Partial<Coords>>,
  WaterHeight: ResolverTypeWrapper<Partial<WaterHeight>>,
  WaterTemperature: ResolverTypeWrapper<Object>,
  WaterTemperatureSummary: ResolverTypeWrapper<Partial<WaterTemperatureSummary>>,
  TemperatureDetail: ResolverTypeWrapper<Partial<TemperatureDetail>>,
  Temperature: ResolverTypeWrapper<Partial<Temperature>>,
  Salinity: ResolverTypeWrapper<Partial<Salinity>>,
  SalinitySummary: ResolverTypeWrapper<Partial<SalinitySummary>>,
  SalinityDetail: ResolverTypeWrapper<Partial<SalinityDetail>>,
  UsgsParam: ResolverTypeWrapper<Partial<UsgsParam>>,
  SunDetail: ResolverTypeWrapper<Partial<SunDetail>>,
  MoonDetail: ResolverTypeWrapper<Partial<MoonDetail>>,
  Int: ResolverTypeWrapper<Partial<Scalars['Int']>>,
  CombinedForecast: ResolverTypeWrapper<Partial<CombinedForecast>>,
  WindForecast: ResolverTypeWrapper<Partial<WindForecast>>,
  ForecastWindSpeedDetail: ResolverTypeWrapper<Partial<ForecastWindSpeedDetail>>,
  WindDirection: ResolverTypeWrapper<Partial<WindDirection>>,
  WaterCondition: ResolverTypeWrapper<Partial<WaterCondition>>,
  CombinedForecastV2: ResolverTypeWrapper<Partial<CombinedForecastV2>>,
  ForecastWindDetailV2: ResolverTypeWrapper<Partial<ForecastWindDetailV2>>,
  ForecastWaveDetail: ResolverTypeWrapper<Partial<ForecastWaveDetail>>,
  ForecastDescription: ResolverTypeWrapper<Partial<ForecastDescription>>,
  RainDetail: ResolverTypeWrapper<Partial<RainDetail>>,
  WeatherForecast: ResolverTypeWrapper<Partial<WeatherForecast>>,
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']>>,
  MarineForecast: ResolverTypeWrapper<Partial<MarineForecast>>,
  MarineForecastDetail: ResolverTypeWrapper<Partial<MarineForecastDetail>>,
  Wind: ResolverTypeWrapper<Partial<Wind> & {location: LocationEntity}>,
  WindSummary: ResolverTypeWrapper<Partial<WindSummary>>,
  WindDetail: ResolverTypeWrapper<Partial<WindDetail>>,
  TemperatureResult: ResolverTypeWrapper<Partial<TemperatureResult> & {location: LocationEntity}>,
  TemperatureSummary: ResolverTypeWrapper<Partial<TemperatureSummary>>,
  Maps: ResolverTypeWrapper<Partial<Maps> & {location: LocationEntity}>,
  Map: ResolverTypeWrapper<Partial<Map>>,
  Overlays: ResolverTypeWrapper<Partial<Overlays>>,
  DataSources: ResolverTypeWrapper<Partial<DataSources>>,
  ModisMap: ResolverTypeWrapper<Partial<ModisMap>>,
  ModisSatellite: ResolverTypeWrapper<Partial<ModisSatellite>>,
  ModisMapEntry: ResolverTypeWrapper<Partial<ModisMapEntry>>,
  CurrentWind: ResolverTypeWrapper<Partial<CurrentWind>>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  Location: LocationEntity,
  ID: Partial<Scalars['ID']>,
  String: Partial<Scalars['String']>,
  TidePreditionStation: TideStationEntity,
  Float: Partial<Scalars['Float']>,
  TideDetail: Partial<TideDetail>,
  UsgsSite: UsgsSiteEntity,
  Coords: Partial<Coords>,
  WaterHeight: Partial<WaterHeight>,
  WaterTemperature: Object,
  WaterTemperatureSummary: Partial<WaterTemperatureSummary>,
  TemperatureDetail: Partial<TemperatureDetail>,
  Temperature: Partial<Temperature>,
  Salinity: Partial<Salinity>,
  SalinitySummary: Partial<SalinitySummary>,
  SalinityDetail: Partial<SalinityDetail>,
  UsgsParam: Partial<UsgsParam>,
  SunDetail: Partial<SunDetail>,
  MoonDetail: Partial<MoonDetail>,
  Int: Partial<Scalars['Int']>,
  CombinedForecast: Partial<CombinedForecast>,
  WindForecast: Partial<WindForecast>,
  ForecastWindSpeedDetail: Partial<ForecastWindSpeedDetail>,
  WindDirection: Partial<WindDirection>,
  WaterCondition: Partial<WaterCondition>,
  CombinedForecastV2: Partial<CombinedForecastV2>,
  ForecastWindDetailV2: Partial<ForecastWindDetailV2>,
  ForecastWaveDetail: Partial<ForecastWaveDetail>,
  ForecastDescription: Partial<ForecastDescription>,
  RainDetail: Partial<RainDetail>,
  WeatherForecast: Partial<WeatherForecast>,
  Boolean: Partial<Scalars['Boolean']>,
  MarineForecast: Partial<MarineForecast>,
  MarineForecastDetail: Partial<MarineForecastDetail>,
  Wind: Partial<Wind> & {location: LocationEntity},
  WindSummary: Partial<WindSummary>,
  WindDetail: Partial<WindDetail>,
  TemperatureResult: Partial<TemperatureResult> & {location: LocationEntity},
  TemperatureSummary: Partial<TemperatureSummary>,
  Maps: Partial<Maps> & {location: LocationEntity},
  Map: Partial<Map>,
  Overlays: Partial<Overlays>,
  DataSources: Partial<DataSources>,
  ModisMap: Partial<ModisMap>,
  ModisSatellite: Partial<ModisSatellite>,
  ModisMapEntry: Partial<ModisMapEntry>,
  CurrentWind: Partial<CurrentWind>,
};

export type CombinedForecastResolvers<ContextType = Context, ParentType = ResolversParentTypes['CombinedForecast']> = {
  timePeriod?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  wind?: Resolver<ResolversTypes['WindForecast'], ParentType, ContextType>,
  waterCondition?: Resolver<Maybe<ResolversTypes['WaterCondition']>, ParentType, ContextType>,
  temperature?: Resolver<ResolversTypes['Temperature'], ParentType, ContextType>,
  marine?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  short?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  detailed?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  chanceOfPrecipitation?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  icon?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type CombinedForecastV2Resolvers<ContextType = Context, ParentType = ResolversParentTypes['CombinedForecastV2']> = {
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  wind?: Resolver<Array<ResolversTypes['ForecastWindDetailV2']>, ParentType, ContextType>,
  waves?: Resolver<Array<ResolversTypes['ForecastWaveDetail']>, ParentType, ContextType>,
  temperature?: Resolver<Array<ResolversTypes['TemperatureDetail']>, ParentType, ContextType>,
  day?: Resolver<ResolversTypes['ForecastDescription'], ParentType, ContextType>,
  night?: Resolver<ResolversTypes['ForecastDescription'], ParentType, ContextType>,
  rain?: Resolver<Array<ResolversTypes['RainDetail']>, ParentType, ContextType>,
};

export type CoordsResolvers<ContextType = Context, ParentType = ResolversParentTypes['Coords']> = {
  lat?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  lon?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
};

export type CurrentWindResolvers<ContextType = Context, ParentType = ResolversParentTypes['CurrentWind']> = {
  speed?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  direction?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  directionDegrees?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
};

export type DataSourcesResolvers<ContextType = Context, ParentType = ResolversParentTypes['DataSources']> = {
  tideStationIds?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>,
  marineZoneId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  usgsSiteId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  weatherStationId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  weatherRadarSiteId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type ForecastDescriptionResolvers<ContextType = Context, ParentType = ResolversParentTypes['ForecastDescription']> = {
  short?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  detailed?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
};

export type ForecastWaveDetailResolvers<ContextType = Context, ParentType = ResolversParentTypes['ForecastWaveDetail']> = {
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  height?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  direction?: Resolver<ResolversTypes['WindDirection'], ParentType, ContextType>,
};

export type ForecastWindDetailV2Resolvers<ContextType = Context, ParentType = ResolversParentTypes['ForecastWindDetailV2']> = {
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  base?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  gusts?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  direction?: Resolver<ResolversTypes['WindDirection'], ParentType, ContextType>,
};

export type ForecastWindSpeedDetailResolvers<ContextType = Context, ParentType = ResolversParentTypes['ForecastWindSpeedDetail']> = {
  from?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  to?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
};

export type LocationResolvers<ContextType = Context, ParentType = ResolversParentTypes['Location']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  tidePreditionStations?: Resolver<Array<ResolversTypes['TidePreditionStation']>, ParentType, ContextType>,
  usgsSites?: Resolver<Array<ResolversTypes['UsgsSite']>, ParentType, ContextType>,
  coords?: Resolver<ResolversTypes['Coords'], ParentType, ContextType>,
  sun?: Resolver<Maybe<Array<ResolversTypes['SunDetail']>>, ParentType, ContextType, LocationSunArgs>,
  moon?: Resolver<Maybe<Array<ResolversTypes['MoonDetail']>>, ParentType, ContextType, LocationMoonArgs>,
  combinedForecast?: Resolver<Maybe<Array<ResolversTypes['CombinedForecast']>>, ParentType, ContextType>,
  combinedForecastV2?: Resolver<Maybe<Array<ResolversTypes['CombinedForecastV2']>>, ParentType, ContextType, LocationCombinedForecastV2Args>,
  weatherForecast?: Resolver<Maybe<Array<ResolversTypes['WeatherForecast']>>, ParentType, ContextType>,
  hourlyWeatherForecast?: Resolver<Maybe<Array<ResolversTypes['WeatherForecast']>>, ParentType, ContextType>,
  marineForecast?: Resolver<Maybe<Array<ResolversTypes['MarineForecast']>>, ParentType, ContextType>,
  wind?: Resolver<Maybe<ResolversTypes['Wind']>, ParentType, ContextType>,
  temperature?: Resolver<ResolversTypes['TemperatureResult'], ParentType, ContextType>,
  maps?: Resolver<Maybe<ResolversTypes['Maps']>, ParentType, ContextType>,
  dataSources?: Resolver<Maybe<ResolversTypes['DataSources']>, ParentType, ContextType>,
  modisMaps?: Resolver<Array<ResolversTypes['ModisMap']>, ParentType, ContextType, LocationModisMapsArgs>,
  salinityMap?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type MapResolvers<ContextType = Context, ParentType = ResolversParentTypes['Map']> = {
  imageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type MapsResolvers<ContextType = Context, ParentType = ResolversParentTypes['Maps']> = {
  radar?: Resolver<Array<ResolversTypes['Map']>, ParentType, ContextType, MapsRadarArgs>,
  overlays?: Resolver<ResolversTypes['Overlays'], ParentType, ContextType>,
};

export type MarineForecastResolvers<ContextType = Context, ParentType = ResolversParentTypes['MarineForecast']> = {
  timePeriod?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  forecast?: Resolver<ResolversTypes['MarineForecastDetail'], ParentType, ContextType>,
};

export type MarineForecastDetailResolvers<ContextType = Context, ParentType = ResolversParentTypes['MarineForecastDetail']> = {
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  waterCondition?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  windSpeed?: Resolver<Maybe<ResolversTypes['ForecastWindSpeedDetail']>, ParentType, ContextType>,
  windDirection?: Resolver<Maybe<ResolversTypes['WindDirection']>, ParentType, ContextType>,
};

export type ModisMapResolvers<ContextType = Context, ParentType = ResolversParentTypes['ModisMap']> = {
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  satellite?: Resolver<ResolversTypes['ModisSatellite'], ParentType, ContextType>,
  small?: Resolver<ResolversTypes['ModisMapEntry'], ParentType, ContextType>,
  medium?: Resolver<ResolversTypes['ModisMapEntry'], ParentType, ContextType>,
  large?: Resolver<ResolversTypes['ModisMapEntry'], ParentType, ContextType>,
};

export type ModisMapEntryResolvers<ContextType = Context, ParentType = ResolversParentTypes['ModisMapEntry']> = {
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  width?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
};

export type MoonDetailResolvers<ContextType = Context, ParentType = ResolversParentTypes['MoonDetail']> = {
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  phase?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  illumination?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
};

export type OverlaysResolvers<ContextType = Context, ParentType = ResolversParentTypes['Overlays']> = {
  topo?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  counties?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  rivers?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  highways?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  cities?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type QueryResolvers<ContextType = Context, ParentType = ResolversParentTypes['Query']> = {
  locations?: Resolver<Array<ResolversTypes['Location']>, ParentType, ContextType>,
  location?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType, QueryLocationArgs>,
  tidePreditionStation?: Resolver<Maybe<ResolversTypes['TidePreditionStation']>, ParentType, ContextType, QueryTidePreditionStationArgs>,
  usgsSite?: Resolver<Maybe<ResolversTypes['UsgsSite']>, ParentType, ContextType, QueryUsgsSiteArgs>,
};

export type RainDetailResolvers<ContextType = Context, ParentType = ResolversParentTypes['RainDetail']> = {
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  mmPerHour?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
};

export type SalinityResolvers<ContextType = Context, ParentType = ResolversParentTypes['Salinity']> = {
  summary?: Resolver<Maybe<ResolversTypes['SalinitySummary']>, ParentType, ContextType>,
  detail?: Resolver<Maybe<Array<ResolversTypes['SalinityDetail']>>, ParentType, ContextType>,
};

export type SalinityDetailResolvers<ContextType = Context, ParentType = ResolversParentTypes['SalinityDetail']> = {
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  salinity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
};

export type SalinitySummaryResolvers<ContextType = Context, ParentType = ResolversParentTypes['SalinitySummary']> = {
  mostRecent?: Resolver<Maybe<ResolversTypes['SalinityDetail']>, ParentType, ContextType>,
};

export type SunDetailResolvers<ContextType = Context, ParentType = ResolversParentTypes['SunDetail']> = {
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  sunrise?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  sunset?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  dawn?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  dusk?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  nauticalDawn?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  nauticalDusk?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type TemperatureResolvers<ContextType = Context, ParentType = ResolversParentTypes['Temperature']> = {
  degrees?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  unit?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type TemperatureDetailResolvers<ContextType = Context, ParentType = ResolversParentTypes['TemperatureDetail']> = {
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  temperature?: Resolver<ResolversTypes['Temperature'], ParentType, ContextType>,
};

export type TemperatureResultResolvers<ContextType = Context, ParentType = ResolversParentTypes['TemperatureResult']> = {
  summary?: Resolver<ResolversTypes['TemperatureSummary'], ParentType, ContextType>,
  detail?: Resolver<Maybe<Array<ResolversTypes['TemperatureDetail']>>, ParentType, ContextType, TemperatureResultDetailArgs>,
};

export type TemperatureSummaryResolvers<ContextType = Context, ParentType = ResolversParentTypes['TemperatureSummary']> = {
  mostRecent?: Resolver<ResolversTypes['TemperatureDetail'], ParentType, ContextType>,
};

export type TideDetailResolvers<ContextType = Context, ParentType = ResolversParentTypes['TideDetail']> = {
  time?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  height?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type TidePreditionStationResolvers<ContextType = Context, ParentType = ResolversParentTypes['TidePreditionStation']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  lat?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  long?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  tides?: Resolver<Maybe<Array<ResolversTypes['TideDetail']>>, ParentType, ContextType, TidePreditionStationTidesArgs>,
};

export type UsgsSiteResolvers<ContextType = Context, ParentType = ResolversParentTypes['UsgsSite']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  coords?: Resolver<ResolversTypes['Coords'], ParentType, ContextType>,
  waterHeight?: Resolver<Maybe<Array<ResolversTypes['WaterHeight']>>, ParentType, ContextType, UsgsSiteWaterHeightArgs>,
  waterTemperature?: Resolver<Maybe<ResolversTypes['WaterTemperature']>, ParentType, ContextType>,
  salinity?: Resolver<Maybe<ResolversTypes['Salinity']>, ParentType, ContextType, UsgsSiteSalinityArgs>,
  availableParams?: Resolver<Array<ResolversTypes['UsgsParam']>, ParentType, ContextType>,
};

export type WaterConditionResolvers<ContextType = Context, ParentType = ResolversParentTypes['WaterCondition']> = {
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  icon?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type WaterHeightResolvers<ContextType = Context, ParentType = ResolversParentTypes['WaterHeight']> = {
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  height?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
};

export type WaterTemperatureResolvers<ContextType = Context, ParentType = ResolversParentTypes['WaterTemperature']> = {
  summary?: Resolver<ResolversTypes['WaterTemperatureSummary'], ParentType, ContextType>,
  detail?: Resolver<Maybe<Array<ResolversTypes['TemperatureDetail']>>, ParentType, ContextType, WaterTemperatureDetailArgs>,
};

export type WaterTemperatureSummaryResolvers<ContextType = Context, ParentType = ResolversParentTypes['WaterTemperatureSummary']> = {
  mostRecent?: Resolver<Maybe<ResolversTypes['TemperatureDetail']>, ParentType, ContextType>,
};

export type WeatherForecastResolvers<ContextType = Context, ParentType = ResolversParentTypes['WeatherForecast']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  startTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  endTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  isDaytime?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  temperature?: Resolver<ResolversTypes['Temperature'], ParentType, ContextType>,
  windSpeed?: Resolver<Maybe<ResolversTypes['ForecastWindSpeedDetail']>, ParentType, ContextType>,
  windDirection?: Resolver<Maybe<ResolversTypes['WindDirection']>, ParentType, ContextType>,
  icon?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  shortForecast?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  detailedForecast?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  chanceOfPrecipitation?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
};

export type WindResolvers<ContextType = Context, ParentType = ResolversParentTypes['Wind']> = {
  summary?: Resolver<ResolversTypes['WindSummary'], ParentType, ContextType>,
  detail?: Resolver<Maybe<Array<ResolversTypes['WindDetail']>>, ParentType, ContextType, WindDetailArgs>,
};

export type WindDetailResolvers<ContextType = Context, ParentType = ResolversParentTypes['WindDetail']> = {
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  speed?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  direction?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  directionDegrees?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
};

export type WindDirectionResolvers<ContextType = Context, ParentType = ResolversParentTypes['WindDirection']> = {
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  degrees?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
};

export type WindForecastResolvers<ContextType = Context, ParentType = ResolversParentTypes['WindForecast']> = {
  speed?: Resolver<Maybe<ResolversTypes['ForecastWindSpeedDetail']>, ParentType, ContextType>,
  direction?: Resolver<Maybe<ResolversTypes['WindDirection']>, ParentType, ContextType>,
};

export type WindSummaryResolvers<ContextType = Context, ParentType = ResolversParentTypes['WindSummary']> = {
  mostRecent?: Resolver<Maybe<ResolversTypes['WindDetail']>, ParentType, ContextType>,
};

export type Resolvers<ContextType = Context> = {
  CombinedForecast?: CombinedForecastResolvers<ContextType>,
  CombinedForecastV2?: CombinedForecastV2Resolvers<ContextType>,
  Coords?: CoordsResolvers<ContextType>,
  CurrentWind?: CurrentWindResolvers<ContextType>,
  DataSources?: DataSourcesResolvers<ContextType>,
  ForecastDescription?: ForecastDescriptionResolvers<ContextType>,
  ForecastWaveDetail?: ForecastWaveDetailResolvers<ContextType>,
  ForecastWindDetailV2?: ForecastWindDetailV2Resolvers<ContextType>,
  ForecastWindSpeedDetail?: ForecastWindSpeedDetailResolvers<ContextType>,
  Location?: LocationResolvers<ContextType>,
  Map?: MapResolvers<ContextType>,
  Maps?: MapsResolvers<ContextType>,
  MarineForecast?: MarineForecastResolvers<ContextType>,
  MarineForecastDetail?: MarineForecastDetailResolvers<ContextType>,
  ModisMap?: ModisMapResolvers<ContextType>,
  ModisMapEntry?: ModisMapEntryResolvers<ContextType>,
  MoonDetail?: MoonDetailResolvers<ContextType>,
  Overlays?: OverlaysResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  RainDetail?: RainDetailResolvers<ContextType>,
  Salinity?: SalinityResolvers<ContextType>,
  SalinityDetail?: SalinityDetailResolvers<ContextType>,
  SalinitySummary?: SalinitySummaryResolvers<ContextType>,
  SunDetail?: SunDetailResolvers<ContextType>,
  Temperature?: TemperatureResolvers<ContextType>,
  TemperatureDetail?: TemperatureDetailResolvers<ContextType>,
  TemperatureResult?: TemperatureResultResolvers<ContextType>,
  TemperatureSummary?: TemperatureSummaryResolvers<ContextType>,
  TideDetail?: TideDetailResolvers<ContextType>,
  TidePreditionStation?: TidePreditionStationResolvers<ContextType>,
  UsgsSite?: UsgsSiteResolvers<ContextType>,
  WaterCondition?: WaterConditionResolvers<ContextType>,
  WaterHeight?: WaterHeightResolvers<ContextType>,
  WaterTemperature?: WaterTemperatureResolvers<ContextType>,
  WaterTemperatureSummary?: WaterTemperatureSummaryResolvers<ContextType>,
  WeatherForecast?: WeatherForecastResolvers<ContextType>,
  Wind?: WindResolvers<ContextType>,
  WindDetail?: WindDetailResolvers<ContextType>,
  WindDirection?: WindDirectionResolvers<ContextType>,
  WindForecast?: WindForecastResolvers<ContextType>,
  WindSummary?: WindSummaryResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;

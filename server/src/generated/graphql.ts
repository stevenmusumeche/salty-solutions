import { GraphQLResolveInfo } from 'graphql';
import { LocationEntity } from '../services/location';
import { NoaaStationEntity } from '../services/noaa/source';
import { UsgsSiteEntity } from '../services/usgs/source';
import { Context } from '../server';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AirPressure = {
  __typename?: 'AirPressure';
  timestamp: Scalars['String'];
  pressure: Scalars['Float'];
};

export type AppVersion = {
  __typename?: 'AppVersion';
  ios: SupportedVersion;
  android: SupportedVersion;
};

export type CombinedForecastV2 = {
  __typename?: 'CombinedForecastV2';
  date: Scalars['String'];
  name: Scalars['String'];
  wind: Array<ForecastWindDetailV2>;
  waves: Array<ForecastWaveDetail>;
  temperature: Array<TemperatureDetail>;
  day: ForecastDescription;
  night: ForecastDescription;
  rain: Array<RainDetail>;
};

export type Coords = {
  __typename?: 'Coords';
  lat: Scalars['Float'];
  lon: Scalars['Float'];
};

export type CurrentWind = {
  __typename?: 'CurrentWind';
  speed: Scalars['Float'];
  direction: Scalars['String'];
  directionDegrees: Scalars['Float'];
};

export type DataSources = {
  __typename?: 'DataSources';
  tideStationIds: Array<Scalars['String']>;
  marineZoneId: Scalars['String'];
  usgsSiteId: Scalars['String'];
  weatherStationId: Scalars['String'];
  weatherRadarSiteId: Scalars['String'];
};

export type ForecastDescription = {
  __typename?: 'ForecastDescription';
  short?: Maybe<Scalars['String']>;
  detailed?: Maybe<Scalars['String']>;
  marine?: Maybe<Scalars['String']>;
};

export type ForecastWaveDetail = {
  __typename?: 'ForecastWaveDetail';
  timestamp: Scalars['String'];
  /** feet */
  height: Scalars['Float'];
  direction: WindDirection;
};

export type ForecastWindDetailV2 = {
  __typename?: 'ForecastWindDetailV2';
  timestamp: Scalars['String'];
  /** mph */
  base: Scalars['Float'];
  /** mph */
  gusts: Scalars['Float'];
  direction: WindDirection;
};

export type ForecastWindSpeedDetail = {
  __typename?: 'ForecastWindSpeedDetail';
  from: Scalars['Int'];
  to: Scalars['Int'];
};

export type Location = {
  __typename?: 'Location';
  id: Scalars['ID'];
  name: Scalars['String'];
  state: Scalars['String'];
  tidePreditionStations: Array<TidePreditionStation>;
  usgsSites: Array<UsgsSite>;
  coords: Coords;
  sun?: Maybe<Array<SunDetail>>;
  moon?: Maybe<Array<MoonDetail>>;
  solunar?: Maybe<Array<SolunarDetail>>;
  combinedForecastV2?: Maybe<Array<CombinedForecastV2>>;
  weatherForecast?: Maybe<Array<WeatherForecast>>;
  hourlyWeatherForecast?: Maybe<Array<WeatherForecast>>;
  marineForecast?: Maybe<Array<MarineForecast>>;
  wind?: Maybe<Wind>;
  temperature: TemperatureResult;
  dataSources?: Maybe<DataSources>;
  modisMaps: Array<ModisMap>;
  salinityMap: Scalars['String'];
};


export type LocationTidePreditionStationsArgs = {
  limit?: Maybe<Scalars['Int']>;
};


export type LocationSunArgs = {
  start: Scalars['String'];
  end: Scalars['String'];
};


export type LocationMoonArgs = {
  start: Scalars['String'];
  end: Scalars['String'];
};


export type LocationSolunarArgs = {
  start: Scalars['String'];
  end: Scalars['String'];
};


export type LocationCombinedForecastV2Args = {
  start: Scalars['String'];
  end: Scalars['String'];
};


export type LocationModisMapsArgs = {
  numDays?: Maybe<Scalars['Int']>;
};

export type MarineForecast = {
  __typename?: 'MarineForecast';
  timePeriod: MarineForecastTimePeriod;
  forecast: MarineForecastDetail;
};

export type MarineForecastDetail = {
  __typename?: 'MarineForecastDetail';
  text: Scalars['String'];
  waterCondition?: Maybe<Scalars['String']>;
  windSpeed?: Maybe<ForecastWindSpeedDetail>;
  windDirection?: Maybe<WindDirection>;
};

export type MarineForecastTimePeriod = {
  __typename?: 'MarineForecastTimePeriod';
  text: Scalars['String'];
  date: Scalars['String'];
  isDaytime: Scalars['Boolean'];
};

export type ModisMap = {
  __typename?: 'ModisMap';
  date: Scalars['String'];
  satellite: ModisSatellite;
  small: ModisMapEntry;
  medium: ModisMapEntry;
  large: ModisMapEntry;
};

export type ModisMapEntry = {
  __typename?: 'ModisMapEntry';
  url: Scalars['String'];
  width: Scalars['Int'];
  height: Scalars['Int'];
};

export enum ModisSatellite {
  Terra = 'TERRA',
  Aqua = 'AQUA'
}

export type MoonDetail = {
  __typename?: 'MoonDetail';
  date: Scalars['String'];
  phase: Scalars['String'];
  illumination: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  userLoggedIn: UserLoggedInResponse;
  /** Create a new user. If user already exists, this is a no-op. */
  createUser: UpsertUserResponse;
};


export type MutationUserLoggedInArgs = {
  input: UserLoggedInInput;
};

export enum NoaaParam {
  Wind = 'Wind',
  WaterLevel = 'WaterLevel',
  AirTemperature = 'AirTemperature',
  WaterTemperature = 'WaterTemperature',
  AirPressure = 'AirPressure',
  TidePrediction = 'TidePrediction'
}

export type NoaaParamInfo = {
  __typename?: 'NoaaParamInfo';
  id: NoaaParam;
  latestDataDate?: Maybe<Scalars['String']>;
};

export enum Platform {
  Web = 'WEB',
  Ios = 'IOS',
  Android = 'ANDROID'
}

export enum PurchasableItem {
  PremiumV1 = 'PREMIUM_V1'
}

export type Query = {
  __typename?: 'Query';
  locations: Array<Location>;
  location?: Maybe<Location>;
  tidePreditionStation?: Maybe<TidePreditionStation>;
  tidePreditionStations: Array<TidePreditionStation>;
  usgsSite?: Maybe<UsgsSite>;
  usgsSites: Array<UsgsSite>;
  appVersion: AppVersion;
  viewer?: Maybe<User>;
};


export type QueryLocationArgs = {
  id: Scalars['ID'];
};


export type QueryTidePreditionStationArgs = {
  stationId?: Maybe<Scalars['ID']>;
};


export type QueryUsgsSiteArgs = {
  siteId?: Maybe<Scalars['ID']>;
};

export type RainDetail = {
  __typename?: 'RainDetail';
  timestamp: Scalars['String'];
  mmPerHour: Scalars['Float'];
};

export type Salinity = {
  __typename?: 'Salinity';
  summary?: Maybe<SalinitySummary>;
  detail?: Maybe<Array<SalinityDetail>>;
};


export type SalinityDetailArgs = {
  start: Scalars['String'];
  end: Scalars['String'];
};

export type SalinityDetail = {
  __typename?: 'SalinityDetail';
  timestamp: Scalars['String'];
  /** parts per thousand */
  salinity: Scalars['Float'];
};

export type SalinitySummary = {
  __typename?: 'SalinitySummary';
  /** parts per thousand */
  mostRecent?: Maybe<SalinityDetail>;
};

export type SolunarDetail = {
  __typename?: 'SolunarDetail';
  date: Scalars['String'];
  score: Scalars['Float'];
  saltyScore: Scalars['Int'];
  majorPeriods: Array<SolunarPeriod>;
  minorPeriods: Array<SolunarPeriod>;
};

export type SolunarPeriod = {
  __typename?: 'SolunarPeriod';
  start: Scalars['String'];
  end: Scalars['String'];
  weight: Scalars['Int'];
};

export type SunDetail = {
  __typename?: 'SunDetail';
  date: Scalars['String'];
  sunrise: Scalars['String'];
  sunset: Scalars['String'];
  dawn: Scalars['String'];
  dusk: Scalars['String'];
  nauticalDawn: Scalars['String'];
  nauticalDusk: Scalars['String'];
};

export type SupportedVersion = {
  __typename?: 'SupportedVersion';
  minimumSupported: Scalars['String'];
  current: Scalars['String'];
};

export type Temperature = {
  __typename?: 'Temperature';
  degrees: Scalars['Float'];
  unit: Scalars['String'];
};

export type TemperatureDetail = {
  __typename?: 'TemperatureDetail';
  timestamp: Scalars['String'];
  temperature: Temperature;
};

export type TemperatureResult = {
  __typename?: 'TemperatureResult';
  summary: TemperatureSummary;
  detail?: Maybe<Array<TemperatureDetail>>;
};


export type TemperatureResultDetailArgs = {
  start: Scalars['String'];
  end: Scalars['String'];
};

export type TemperatureSummary = {
  __typename?: 'TemperatureSummary';
  mostRecent?: Maybe<TemperatureDetail>;
};

export type TideDetail = {
  __typename?: 'TideDetail';
  time: Scalars['String'];
  height: Scalars['Float'];
  type: Scalars['String'];
};

export type TidePreditionStation = {
  __typename?: 'TidePreditionStation';
  id: Scalars['ID'];
  name: Scalars['String'];
  url: Scalars['String'];
  coords: Coords;
  tides?: Maybe<Array<TideDetail>>;
  availableParams: Array<NoaaParam>;
  availableParamsV2: Array<NoaaParamInfo>;
  wind?: Maybe<Wind>;
  temperature?: Maybe<TemperatureResult>;
  waterTemperature?: Maybe<WaterTemperature>;
  salinity?: Maybe<Salinity>;
  waterHeight?: Maybe<Array<WaterHeight>>;
  locations: Array<Location>;
};


export type TidePreditionStationTidesArgs = {
  start: Scalars['String'];
  end: Scalars['String'];
};


export type TidePreditionStationWaterHeightArgs = {
  start: Scalars['String'];
  end: Scalars['String'];
};

export type UpsertUserResponse = {
  __typename?: 'UpsertUserResponse';
  user: User;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
  name: Scalars['String'];
  picture?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  purchases: Array<UserPurchase>;
};

export type UserLoggedInInput = {
  platform: Platform;
};

export type UserLoggedInResponse = {
  __typename?: 'UserLoggedInResponse';
  success: Scalars['Boolean'];
};

export type UserPurchase = {
  __typename?: 'UserPurchase';
  id: Scalars['ID'];
  item: PurchasableItem;
  priceCents: Scalars['Int'];
  platform: Platform;
  isActive: Scalars['Boolean'];
  purchaseDate: Scalars['String'];
  endDate?: Maybe<Scalars['String']>;
};

export enum UsgsParam {
  WaterTemp = 'WaterTemp',
  WindSpeed = 'WindSpeed',
  WindDirection = 'WindDirection',
  GuageHeight = 'GuageHeight',
  Salinity = 'Salinity'
}

export type UsgsParamInfo = {
  __typename?: 'UsgsParamInfo';
  id: UsgsParam;
  latestDataDate?: Maybe<Scalars['String']>;
};

export type UsgsSite = {
  __typename?: 'UsgsSite';
  id: Scalars['ID'];
  url: Scalars['String'];
  name: Scalars['String'];
  coords: Coords;
  waterHeight?: Maybe<Array<WaterHeight>>;
  waterTemperature?: Maybe<WaterTemperature>;
  wind?: Maybe<Wind>;
  salinity?: Maybe<Salinity>;
  availableParams: Array<UsgsParam>;
  availableParamsV2: Array<UsgsParamInfo>;
  locations: Array<Location>;
};


export type UsgsSiteWaterHeightArgs = {
  start: Scalars['String'];
  end: Scalars['String'];
};

export type WaterHeight = {
  __typename?: 'WaterHeight';
  timestamp: Scalars['String'];
  /** measured in feet */
  height: Scalars['Float'];
};

export type WaterTemperature = {
  __typename?: 'WaterTemperature';
  summary: TemperatureSummary;
  detail?: Maybe<Array<TemperatureDetail>>;
};


export type WaterTemperatureDetailArgs = {
  start: Scalars['String'];
  end: Scalars['String'];
};

export type WeatherForecast = {
  __typename?: 'WeatherForecast';
  name: Scalars['String'];
  startTime: Scalars['String'];
  endTime: Scalars['String'];
  isDaytime: Scalars['Boolean'];
  temperature: Temperature;
  windSpeed?: Maybe<ForecastWindSpeedDetail>;
  windDirection?: Maybe<WindDirection>;
  icon: Scalars['String'];
  shortForecast: Scalars['String'];
  detailedForecast: Scalars['String'];
  chanceOfPrecipitation?: Maybe<Scalars['Int']>;
};

export type Wind = {
  __typename?: 'Wind';
  summary: WindSummary;
  detail?: Maybe<Array<WindDetail>>;
};


export type WindDetailArgs = {
  start: Scalars['String'];
  end: Scalars['String'];
};

export type WindDetail = {
  __typename?: 'WindDetail';
  timestamp: Scalars['String'];
  /** miles per hour */
  speed: Scalars['Float'];
  direction: Scalars['String'];
  directionDegrees: Scalars['Float'];
};

export type WindDirection = {
  __typename?: 'WindDirection';
  text: Scalars['String'];
  degrees: Scalars['Int'];
};

export type WindSummary = {
  __typename?: 'WindSummary';
  mostRecent?: Maybe<WindDetail>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

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

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

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
  Query: ResolverTypeWrapper<{}>;
  Location: ResolverTypeWrapper<LocationEntity>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']>>;
  String: ResolverTypeWrapper<Partial<Scalars['String']>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']>>;
  TidePreditionStation: ResolverTypeWrapper<NoaaStationEntity>;
  Coords: ResolverTypeWrapper<Partial<Coords>>;
  Float: ResolverTypeWrapper<Partial<Scalars['Float']>>;
  TideDetail: ResolverTypeWrapper<Partial<TideDetail>>;
  NoaaParam: ResolverTypeWrapper<Partial<NoaaParam>>;
  NoaaParamInfo: ResolverTypeWrapper<Partial<NoaaParamInfo> & {station: NoaaStationEntity}>;
  Wind: ResolverTypeWrapper<Partial<Wind> & {location?: LocationEntity, site?: UsgsSiteEntity, station?: NoaaStationEntity}>;
  WindSummary: ResolverTypeWrapper<Partial<WindSummary>>;
  WindDetail: ResolverTypeWrapper<Partial<WindDetail>>;
  TemperatureResult: ResolverTypeWrapper<Partial<TemperatureResult> & {location?: LocationEntity, station?: NoaaStationEntity}>;
  TemperatureSummary: ResolverTypeWrapper<Partial<TemperatureSummary>>;
  TemperatureDetail: ResolverTypeWrapper<Partial<TemperatureDetail>>;
  Temperature: ResolverTypeWrapper<Partial<Temperature>>;
  WaterTemperature: ResolverTypeWrapper<Partial<WaterTemperature> & {site?: UsgsSiteEntity, station?: NoaaStationEntity}>;
  Salinity: ResolverTypeWrapper<Partial<Salinity> & {site: UsgsSiteEntity}>;
  SalinitySummary: ResolverTypeWrapper<Partial<SalinitySummary>>;
  SalinityDetail: ResolverTypeWrapper<Partial<SalinityDetail>>;
  WaterHeight: ResolverTypeWrapper<Partial<WaterHeight>>;
  UsgsSite: ResolverTypeWrapper<UsgsSiteEntity>;
  UsgsParam: ResolverTypeWrapper<Partial<UsgsParam>>;
  UsgsParamInfo: ResolverTypeWrapper<Partial<UsgsParamInfo> & {site: UsgsSiteEntity}>;
  SunDetail: ResolverTypeWrapper<Partial<SunDetail>>;
  MoonDetail: ResolverTypeWrapper<Partial<MoonDetail>>;
  SolunarDetail: ResolverTypeWrapper<Partial<SolunarDetail>>;
  SolunarPeriod: ResolverTypeWrapper<Partial<SolunarPeriod>>;
  CombinedForecastV2: ResolverTypeWrapper<Partial<CombinedForecastV2>>;
  ForecastWindDetailV2: ResolverTypeWrapper<Partial<ForecastWindDetailV2>>;
  WindDirection: ResolverTypeWrapper<Partial<WindDirection>>;
  ForecastWaveDetail: ResolverTypeWrapper<Partial<ForecastWaveDetail>>;
  ForecastDescription: ResolverTypeWrapper<Partial<ForecastDescription>>;
  RainDetail: ResolverTypeWrapper<Partial<RainDetail>>;
  WeatherForecast: ResolverTypeWrapper<Partial<WeatherForecast>>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']>>;
  ForecastWindSpeedDetail: ResolverTypeWrapper<Partial<ForecastWindSpeedDetail>>;
  MarineForecast: ResolverTypeWrapper<Partial<MarineForecast>>;
  MarineForecastTimePeriod: ResolverTypeWrapper<Partial<MarineForecastTimePeriod>>;
  MarineForecastDetail: ResolverTypeWrapper<Partial<MarineForecastDetail>>;
  DataSources: ResolverTypeWrapper<Partial<DataSources>>;
  ModisMap: ResolverTypeWrapper<Partial<ModisMap>>;
  ModisSatellite: ResolverTypeWrapper<Partial<ModisSatellite>>;
  ModisMapEntry: ResolverTypeWrapper<Partial<ModisMapEntry>>;
  AppVersion: ResolverTypeWrapper<Partial<AppVersion>>;
  SupportedVersion: ResolverTypeWrapper<Partial<SupportedVersion>>;
  User: ResolverTypeWrapper<Partial<User>>;
  UserPurchase: ResolverTypeWrapper<Partial<UserPurchase>>;
  PurchasableItem: ResolverTypeWrapper<Partial<PurchasableItem>>;
  Platform: ResolverTypeWrapper<Partial<Platform>>;
  Mutation: ResolverTypeWrapper<{}>;
  UserLoggedInInput: ResolverTypeWrapper<Partial<UserLoggedInInput>>;
  UserLoggedInResponse: ResolverTypeWrapper<Partial<UserLoggedInResponse>>;
  UpsertUserResponse: ResolverTypeWrapper<Partial<UpsertUserResponse>>;
  AirPressure: ResolverTypeWrapper<Partial<AirPressure>>;
  CurrentWind: ResolverTypeWrapper<Partial<CurrentWind>>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  Location: LocationEntity;
  ID: Partial<Scalars['ID']>;
  String: Partial<Scalars['String']>;
  Int: Partial<Scalars['Int']>;
  TidePreditionStation: NoaaStationEntity;
  Coords: Partial<Coords>;
  Float: Partial<Scalars['Float']>;
  TideDetail: Partial<TideDetail>;
  NoaaParamInfo: Partial<NoaaParamInfo> & {station: NoaaStationEntity};
  Wind: Partial<Wind> & {location?: LocationEntity, site?: UsgsSiteEntity, station?: NoaaStationEntity};
  WindSummary: Partial<WindSummary>;
  WindDetail: Partial<WindDetail>;
  TemperatureResult: Partial<TemperatureResult> & {location?: LocationEntity, station?: NoaaStationEntity};
  TemperatureSummary: Partial<TemperatureSummary>;
  TemperatureDetail: Partial<TemperatureDetail>;
  Temperature: Partial<Temperature>;
  WaterTemperature: Partial<WaterTemperature> & {site?: UsgsSiteEntity, station?: NoaaStationEntity};
  Salinity: Partial<Salinity> & {site: UsgsSiteEntity};
  SalinitySummary: Partial<SalinitySummary>;
  SalinityDetail: Partial<SalinityDetail>;
  WaterHeight: Partial<WaterHeight>;
  UsgsSite: UsgsSiteEntity;
  UsgsParamInfo: Partial<UsgsParamInfo> & {site: UsgsSiteEntity};
  SunDetail: Partial<SunDetail>;
  MoonDetail: Partial<MoonDetail>;
  SolunarDetail: Partial<SolunarDetail>;
  SolunarPeriod: Partial<SolunarPeriod>;
  CombinedForecastV2: Partial<CombinedForecastV2>;
  ForecastWindDetailV2: Partial<ForecastWindDetailV2>;
  WindDirection: Partial<WindDirection>;
  ForecastWaveDetail: Partial<ForecastWaveDetail>;
  ForecastDescription: Partial<ForecastDescription>;
  RainDetail: Partial<RainDetail>;
  WeatherForecast: Partial<WeatherForecast>;
  Boolean: Partial<Scalars['Boolean']>;
  ForecastWindSpeedDetail: Partial<ForecastWindSpeedDetail>;
  MarineForecast: Partial<MarineForecast>;
  MarineForecastTimePeriod: Partial<MarineForecastTimePeriod>;
  MarineForecastDetail: Partial<MarineForecastDetail>;
  DataSources: Partial<DataSources>;
  ModisMap: Partial<ModisMap>;
  ModisMapEntry: Partial<ModisMapEntry>;
  AppVersion: Partial<AppVersion>;
  SupportedVersion: Partial<SupportedVersion>;
  User: Partial<User>;
  UserPurchase: Partial<UserPurchase>;
  Mutation: {};
  UserLoggedInInput: Partial<UserLoggedInInput>;
  UserLoggedInResponse: Partial<UserLoggedInResponse>;
  UpsertUserResponse: Partial<UpsertUserResponse>;
  AirPressure: Partial<AirPressure>;
  CurrentWind: Partial<CurrentWind>;
};

export type AirPressureResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AirPressure'] = ResolversParentTypes['AirPressure']> = {
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pressure?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppVersionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AppVersion'] = ResolversParentTypes['AppVersion']> = {
  ios?: Resolver<ResolversTypes['SupportedVersion'], ParentType, ContextType>;
  android?: Resolver<ResolversTypes['SupportedVersion'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CombinedForecastV2Resolvers<ContextType = Context, ParentType extends ResolversParentTypes['CombinedForecastV2'] = ResolversParentTypes['CombinedForecastV2']> = {
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  wind?: Resolver<Array<ResolversTypes['ForecastWindDetailV2']>, ParentType, ContextType>;
  waves?: Resolver<Array<ResolversTypes['ForecastWaveDetail']>, ParentType, ContextType>;
  temperature?: Resolver<Array<ResolversTypes['TemperatureDetail']>, ParentType, ContextType>;
  day?: Resolver<ResolversTypes['ForecastDescription'], ParentType, ContextType>;
  night?: Resolver<ResolversTypes['ForecastDescription'], ParentType, ContextType>;
  rain?: Resolver<Array<ResolversTypes['RainDetail']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CoordsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Coords'] = ResolversParentTypes['Coords']> = {
  lat?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  lon?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CurrentWindResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CurrentWind'] = ResolversParentTypes['CurrentWind']> = {
  speed?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  direction?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  directionDegrees?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DataSourcesResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DataSources'] = ResolversParentTypes['DataSources']> = {
  tideStationIds?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  marineZoneId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  usgsSiteId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  weatherStationId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  weatherRadarSiteId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ForecastDescriptionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ForecastDescription'] = ResolversParentTypes['ForecastDescription']> = {
  short?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  detailed?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  marine?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ForecastWaveDetailResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ForecastWaveDetail'] = ResolversParentTypes['ForecastWaveDetail']> = {
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  direction?: Resolver<ResolversTypes['WindDirection'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ForecastWindDetailV2Resolvers<ContextType = Context, ParentType extends ResolversParentTypes['ForecastWindDetailV2'] = ResolversParentTypes['ForecastWindDetailV2']> = {
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  base?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  gusts?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  direction?: Resolver<ResolversTypes['WindDirection'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ForecastWindSpeedDetailResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ForecastWindSpeedDetail'] = ResolversParentTypes['ForecastWindSpeedDetail']> = {
  from?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tidePreditionStations?: Resolver<Array<ResolversTypes['TidePreditionStation']>, ParentType, ContextType, RequireFields<LocationTidePreditionStationsArgs, never>>;
  usgsSites?: Resolver<Array<ResolversTypes['UsgsSite']>, ParentType, ContextType>;
  coords?: Resolver<ResolversTypes['Coords'], ParentType, ContextType>;
  sun?: Resolver<Maybe<Array<ResolversTypes['SunDetail']>>, ParentType, ContextType, RequireFields<LocationSunArgs, 'start' | 'end'>>;
  moon?: Resolver<Maybe<Array<ResolversTypes['MoonDetail']>>, ParentType, ContextType, RequireFields<LocationMoonArgs, 'start' | 'end'>>;
  solunar?: Resolver<Maybe<Array<ResolversTypes['SolunarDetail']>>, ParentType, ContextType, RequireFields<LocationSolunarArgs, 'start' | 'end'>>;
  combinedForecastV2?: Resolver<Maybe<Array<ResolversTypes['CombinedForecastV2']>>, ParentType, ContextType, RequireFields<LocationCombinedForecastV2Args, 'start' | 'end'>>;
  weatherForecast?: Resolver<Maybe<Array<ResolversTypes['WeatherForecast']>>, ParentType, ContextType>;
  hourlyWeatherForecast?: Resolver<Maybe<Array<ResolversTypes['WeatherForecast']>>, ParentType, ContextType>;
  marineForecast?: Resolver<Maybe<Array<ResolversTypes['MarineForecast']>>, ParentType, ContextType>;
  wind?: Resolver<Maybe<ResolversTypes['Wind']>, ParentType, ContextType>;
  temperature?: Resolver<ResolversTypes['TemperatureResult'], ParentType, ContextType>;
  dataSources?: Resolver<Maybe<ResolversTypes['DataSources']>, ParentType, ContextType>;
  modisMaps?: Resolver<Array<ResolversTypes['ModisMap']>, ParentType, ContextType, RequireFields<LocationModisMapsArgs, never>>;
  salinityMap?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MarineForecastResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MarineForecast'] = ResolversParentTypes['MarineForecast']> = {
  timePeriod?: Resolver<ResolversTypes['MarineForecastTimePeriod'], ParentType, ContextType>;
  forecast?: Resolver<ResolversTypes['MarineForecastDetail'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MarineForecastDetailResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MarineForecastDetail'] = ResolversParentTypes['MarineForecastDetail']> = {
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  waterCondition?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  windSpeed?: Resolver<Maybe<ResolversTypes['ForecastWindSpeedDetail']>, ParentType, ContextType>;
  windDirection?: Resolver<Maybe<ResolversTypes['WindDirection']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MarineForecastTimePeriodResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MarineForecastTimePeriod'] = ResolversParentTypes['MarineForecastTimePeriod']> = {
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isDaytime?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModisMapResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ModisMap'] = ResolversParentTypes['ModisMap']> = {
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  satellite?: Resolver<ResolversTypes['ModisSatellite'], ParentType, ContextType>;
  small?: Resolver<ResolversTypes['ModisMapEntry'], ParentType, ContextType>;
  medium?: Resolver<ResolversTypes['ModisMapEntry'], ParentType, ContextType>;
  large?: Resolver<ResolversTypes['ModisMapEntry'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModisMapEntryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ModisMapEntry'] = ResolversParentTypes['ModisMapEntry']> = {
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MoonDetailResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MoonDetail'] = ResolversParentTypes['MoonDetail']> = {
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phase?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  illumination?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  userLoggedIn?: Resolver<ResolversTypes['UserLoggedInResponse'], ParentType, ContextType, RequireFields<MutationUserLoggedInArgs, 'input'>>;
  createUser?: Resolver<ResolversTypes['UpsertUserResponse'], ParentType, ContextType>;
};

export type NoaaParamInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NoaaParamInfo'] = ResolversParentTypes['NoaaParamInfo']> = {
  id?: Resolver<ResolversTypes['NoaaParam'], ParentType, ContextType>;
  latestDataDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  locations?: Resolver<Array<ResolversTypes['Location']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType, RequireFields<QueryLocationArgs, 'id'>>;
  tidePreditionStation?: Resolver<Maybe<ResolversTypes['TidePreditionStation']>, ParentType, ContextType, RequireFields<QueryTidePreditionStationArgs, never>>;
  tidePreditionStations?: Resolver<Array<ResolversTypes['TidePreditionStation']>, ParentType, ContextType>;
  usgsSite?: Resolver<Maybe<ResolversTypes['UsgsSite']>, ParentType, ContextType, RequireFields<QueryUsgsSiteArgs, never>>;
  usgsSites?: Resolver<Array<ResolversTypes['UsgsSite']>, ParentType, ContextType>;
  appVersion?: Resolver<ResolversTypes['AppVersion'], ParentType, ContextType>;
  viewer?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
};

export type RainDetailResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RainDetail'] = ResolversParentTypes['RainDetail']> = {
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mmPerHour?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SalinityResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Salinity'] = ResolversParentTypes['Salinity']> = {
  summary?: Resolver<Maybe<ResolversTypes['SalinitySummary']>, ParentType, ContextType>;
  detail?: Resolver<Maybe<Array<ResolversTypes['SalinityDetail']>>, ParentType, ContextType, RequireFields<SalinityDetailArgs, 'start' | 'end'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SalinityDetailResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SalinityDetail'] = ResolversParentTypes['SalinityDetail']> = {
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  salinity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SalinitySummaryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SalinitySummary'] = ResolversParentTypes['SalinitySummary']> = {
  mostRecent?: Resolver<Maybe<ResolversTypes['SalinityDetail']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SolunarDetailResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SolunarDetail'] = ResolversParentTypes['SolunarDetail']> = {
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  saltyScore?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  majorPeriods?: Resolver<Array<ResolversTypes['SolunarPeriod']>, ParentType, ContextType>;
  minorPeriods?: Resolver<Array<ResolversTypes['SolunarPeriod']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SolunarPeriodResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SolunarPeriod'] = ResolversParentTypes['SolunarPeriod']> = {
  start?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  end?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  weight?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SunDetailResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SunDetail'] = ResolversParentTypes['SunDetail']> = {
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sunrise?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sunset?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dawn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dusk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nauticalDawn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nauticalDusk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SupportedVersionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SupportedVersion'] = ResolversParentTypes['SupportedVersion']> = {
  minimumSupported?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  current?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TemperatureResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Temperature'] = ResolversParentTypes['Temperature']> = {
  degrees?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TemperatureDetailResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TemperatureDetail'] = ResolversParentTypes['TemperatureDetail']> = {
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  temperature?: Resolver<ResolversTypes['Temperature'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TemperatureResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TemperatureResult'] = ResolversParentTypes['TemperatureResult']> = {
  summary?: Resolver<ResolversTypes['TemperatureSummary'], ParentType, ContextType>;
  detail?: Resolver<Maybe<Array<ResolversTypes['TemperatureDetail']>>, ParentType, ContextType, RequireFields<TemperatureResultDetailArgs, 'start' | 'end'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TemperatureSummaryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TemperatureSummary'] = ResolversParentTypes['TemperatureSummary']> = {
  mostRecent?: Resolver<Maybe<ResolversTypes['TemperatureDetail']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TideDetailResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TideDetail'] = ResolversParentTypes['TideDetail']> = {
  time?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TidePreditionStationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TidePreditionStation'] = ResolversParentTypes['TidePreditionStation']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  coords?: Resolver<ResolversTypes['Coords'], ParentType, ContextType>;
  tides?: Resolver<Maybe<Array<ResolversTypes['TideDetail']>>, ParentType, ContextType, RequireFields<TidePreditionStationTidesArgs, 'start' | 'end'>>;
  availableParams?: Resolver<Array<ResolversTypes['NoaaParam']>, ParentType, ContextType>;
  availableParamsV2?: Resolver<Array<ResolversTypes['NoaaParamInfo']>, ParentType, ContextType>;
  wind?: Resolver<Maybe<ResolversTypes['Wind']>, ParentType, ContextType>;
  temperature?: Resolver<Maybe<ResolversTypes['TemperatureResult']>, ParentType, ContextType>;
  waterTemperature?: Resolver<Maybe<ResolversTypes['WaterTemperature']>, ParentType, ContextType>;
  salinity?: Resolver<Maybe<ResolversTypes['Salinity']>, ParentType, ContextType>;
  waterHeight?: Resolver<Maybe<Array<ResolversTypes['WaterHeight']>>, ParentType, ContextType, RequireFields<TidePreditionStationWaterHeightArgs, 'start' | 'end'>>;
  locations?: Resolver<Array<ResolversTypes['Location']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpsertUserResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UpsertUserResponse'] = ResolversParentTypes['UpsertUserResponse']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  picture?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  purchases?: Resolver<Array<ResolversTypes['UserPurchase']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserLoggedInResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserLoggedInResponse'] = ResolversParentTypes['UserLoggedInResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserPurchaseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserPurchase'] = ResolversParentTypes['UserPurchase']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  item?: Resolver<ResolversTypes['PurchasableItem'], ParentType, ContextType>;
  priceCents?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  platform?: Resolver<ResolversTypes['Platform'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  purchaseDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsgsParamInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UsgsParamInfo'] = ResolversParentTypes['UsgsParamInfo']> = {
  id?: Resolver<ResolversTypes['UsgsParam'], ParentType, ContextType>;
  latestDataDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsgsSiteResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UsgsSite'] = ResolversParentTypes['UsgsSite']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  coords?: Resolver<ResolversTypes['Coords'], ParentType, ContextType>;
  waterHeight?: Resolver<Maybe<Array<ResolversTypes['WaterHeight']>>, ParentType, ContextType, RequireFields<UsgsSiteWaterHeightArgs, 'start' | 'end'>>;
  waterTemperature?: Resolver<Maybe<ResolversTypes['WaterTemperature']>, ParentType, ContextType>;
  wind?: Resolver<Maybe<ResolversTypes['Wind']>, ParentType, ContextType>;
  salinity?: Resolver<Maybe<ResolversTypes['Salinity']>, ParentType, ContextType>;
  availableParams?: Resolver<Array<ResolversTypes['UsgsParam']>, ParentType, ContextType>;
  availableParamsV2?: Resolver<Array<ResolversTypes['UsgsParamInfo']>, ParentType, ContextType>;
  locations?: Resolver<Array<ResolversTypes['Location']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WaterHeightResolvers<ContextType = Context, ParentType extends ResolversParentTypes['WaterHeight'] = ResolversParentTypes['WaterHeight']> = {
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WaterTemperatureResolvers<ContextType = Context, ParentType extends ResolversParentTypes['WaterTemperature'] = ResolversParentTypes['WaterTemperature']> = {
  summary?: Resolver<ResolversTypes['TemperatureSummary'], ParentType, ContextType>;
  detail?: Resolver<Maybe<Array<ResolversTypes['TemperatureDetail']>>, ParentType, ContextType, RequireFields<WaterTemperatureDetailArgs, 'start' | 'end'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WeatherForecastResolvers<ContextType = Context, ParentType extends ResolversParentTypes['WeatherForecast'] = ResolversParentTypes['WeatherForecast']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isDaytime?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  temperature?: Resolver<ResolversTypes['Temperature'], ParentType, ContextType>;
  windSpeed?: Resolver<Maybe<ResolversTypes['ForecastWindSpeedDetail']>, ParentType, ContextType>;
  windDirection?: Resolver<Maybe<ResolversTypes['WindDirection']>, ParentType, ContextType>;
  icon?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  shortForecast?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  detailedForecast?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chanceOfPrecipitation?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WindResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Wind'] = ResolversParentTypes['Wind']> = {
  summary?: Resolver<ResolversTypes['WindSummary'], ParentType, ContextType>;
  detail?: Resolver<Maybe<Array<ResolversTypes['WindDetail']>>, ParentType, ContextType, RequireFields<WindDetailArgs, 'start' | 'end'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WindDetailResolvers<ContextType = Context, ParentType extends ResolversParentTypes['WindDetail'] = ResolversParentTypes['WindDetail']> = {
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  speed?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  direction?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  directionDegrees?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WindDirectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['WindDirection'] = ResolversParentTypes['WindDirection']> = {
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  degrees?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WindSummaryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['WindSummary'] = ResolversParentTypes['WindSummary']> = {
  mostRecent?: Resolver<Maybe<ResolversTypes['WindDetail']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  AirPressure?: AirPressureResolvers<ContextType>;
  AppVersion?: AppVersionResolvers<ContextType>;
  CombinedForecastV2?: CombinedForecastV2Resolvers<ContextType>;
  Coords?: CoordsResolvers<ContextType>;
  CurrentWind?: CurrentWindResolvers<ContextType>;
  DataSources?: DataSourcesResolvers<ContextType>;
  ForecastDescription?: ForecastDescriptionResolvers<ContextType>;
  ForecastWaveDetail?: ForecastWaveDetailResolvers<ContextType>;
  ForecastWindDetailV2?: ForecastWindDetailV2Resolvers<ContextType>;
  ForecastWindSpeedDetail?: ForecastWindSpeedDetailResolvers<ContextType>;
  Location?: LocationResolvers<ContextType>;
  MarineForecast?: MarineForecastResolvers<ContextType>;
  MarineForecastDetail?: MarineForecastDetailResolvers<ContextType>;
  MarineForecastTimePeriod?: MarineForecastTimePeriodResolvers<ContextType>;
  ModisMap?: ModisMapResolvers<ContextType>;
  ModisMapEntry?: ModisMapEntryResolvers<ContextType>;
  MoonDetail?: MoonDetailResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NoaaParamInfo?: NoaaParamInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RainDetail?: RainDetailResolvers<ContextType>;
  Salinity?: SalinityResolvers<ContextType>;
  SalinityDetail?: SalinityDetailResolvers<ContextType>;
  SalinitySummary?: SalinitySummaryResolvers<ContextType>;
  SolunarDetail?: SolunarDetailResolvers<ContextType>;
  SolunarPeriod?: SolunarPeriodResolvers<ContextType>;
  SunDetail?: SunDetailResolvers<ContextType>;
  SupportedVersion?: SupportedVersionResolvers<ContextType>;
  Temperature?: TemperatureResolvers<ContextType>;
  TemperatureDetail?: TemperatureDetailResolvers<ContextType>;
  TemperatureResult?: TemperatureResultResolvers<ContextType>;
  TemperatureSummary?: TemperatureSummaryResolvers<ContextType>;
  TideDetail?: TideDetailResolvers<ContextType>;
  TidePreditionStation?: TidePreditionStationResolvers<ContextType>;
  UpsertUserResponse?: UpsertUserResponseResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserLoggedInResponse?: UserLoggedInResponseResolvers<ContextType>;
  UserPurchase?: UserPurchaseResolvers<ContextType>;
  UsgsParamInfo?: UsgsParamInfoResolvers<ContextType>;
  UsgsSite?: UsgsSiteResolvers<ContextType>;
  WaterHeight?: WaterHeightResolvers<ContextType>;
  WaterTemperature?: WaterTemperatureResolvers<ContextType>;
  WeatherForecast?: WeatherForecastResolvers<ContextType>;
  Wind?: WindResolvers<ContextType>;
  WindDetail?: WindDetailResolvers<ContextType>;
  WindDirection?: WindDirectionResolvers<ContextType>;
  WindSummary?: WindSummaryResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;

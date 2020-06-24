import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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
  tidePreditionStations: Array<TidePreditionStation>;
  usgsSites: Array<UsgsSite>;
  coords: Coords;
  sun?: Maybe<Array<SunDetail>>;
  moon?: Maybe<Array<MoonDetail>>;
  combinedForecastV2?: Maybe<Array<CombinedForecastV2>>;
  weatherForecast?: Maybe<Array<WeatherForecast>>;
  hourlyWeatherForecast?: Maybe<Array<WeatherForecast>>;
  marineForecast?: Maybe<Array<MarineForecast>>;
  wind?: Maybe<Wind>;
  temperature: TemperatureResult;
  maps?: Maybe<Maps>;
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


export type LocationCombinedForecastV2Args = {
  start: Scalars['String'];
  end: Scalars['String'];
};


export type LocationModisMapsArgs = {
  numDays?: Maybe<Scalars['Int']>;
};

export type Map = {
  __typename?: 'Map';
  imageUrl: Scalars['String'];
  timestamp: Scalars['String'];
};

export type Maps = {
  __typename?: 'Maps';
  radar: Array<Map>;
  overlays: Overlays;
};


export type MapsRadarArgs = {
  numImages?: Maybe<Scalars['Int']>;
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

export enum NoaaParam {
  Wind = 'Wind',
  WaterLevel = 'WaterLevel',
  AirTemperature = 'AirTemperature',
  WaterTemperature = 'WaterTemperature',
  AirPressure = 'AirPressure',
  TidePrediction = 'TidePrediction'
}

export type Overlays = {
  __typename?: 'Overlays';
  topo: Scalars['String'];
  counties: Scalars['String'];
  rivers: Scalars['String'];
  highways: Scalars['String'];
  cities: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  locations: Array<Location>;
  location?: Maybe<Location>;
  tidePreditionStation?: Maybe<TidePreditionStation>;
  usgsSite?: Maybe<UsgsSite>;
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
  wind?: Maybe<Wind>;
  temperature?: Maybe<TemperatureResult>;
  waterTemperature?: Maybe<WaterTemperature>;
  salinity?: Maybe<Salinity>;
  waterHeight?: Maybe<Array<WaterHeight>>;
};


export type TidePreditionStationTidesArgs = {
  start: Scalars['String'];
  end: Scalars['String'];
};


export type TidePreditionStationWaterHeightArgs = {
  start: Scalars['String'];
  end: Scalars['String'];
};

export enum UsgsParam {
  WaterTemp = 'WaterTemp',
  WindSpeed = 'WindSpeed',
  WindDirection = 'WindDirection',
  GuageHeight = 'GuageHeight',
  Salinity = 'Salinity'
}

export type UsgsSite = {
  __typename?: 'UsgsSite';
  id: Scalars['ID'];
  name: Scalars['String'];
  coords: Coords;
  waterHeight?: Maybe<Array<WaterHeight>>;
  waterTemperature?: Maybe<WaterTemperature>;
  wind?: Maybe<Wind>;
  salinity?: Maybe<Salinity>;
  availableParams: Array<UsgsParam>;
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

export type CombinedForecastV2QueryVariables = {
  locationId: Scalars['ID'];
  startDate: Scalars['String'];
  endDate: Scalars['String'];
};


export type CombinedForecastV2Query = (
  { __typename?: 'Query' }
  & { location?: Maybe<(
    { __typename?: 'Location' }
    & Pick<Location, 'id'>
    & { combinedForecastV2?: Maybe<Array<(
      { __typename?: 'CombinedForecastV2' }
      & CombinedForecastV2DetailFragment
    )>>, tidePreditionStations: Array<(
      { __typename?: 'TidePreditionStation' }
      & Pick<TidePreditionStation, 'id' | 'name'>
      & { tides?: Maybe<Array<(
        { __typename?: 'TideDetail' }
        & TideDetailFieldsFragment
      )>> }
    )>, sun?: Maybe<Array<(
      { __typename?: 'SunDetail' }
      & SunDetailFieldsFragment
    )>> }
  )> }
);

export type CombinedForecastV2DetailFragment = (
  { __typename?: 'CombinedForecastV2' }
  & Pick<CombinedForecastV2, 'name' | 'date'>
  & { wind: Array<(
    { __typename?: 'ForecastWindDetailV2' }
    & Pick<ForecastWindDetailV2, 'timestamp' | 'base' | 'gusts'>
    & { direction: (
      { __typename?: 'WindDirection' }
      & Pick<WindDirection, 'text' | 'degrees'>
    ) }
  )>, day: (
    { __typename?: 'ForecastDescription' }
    & Pick<ForecastDescription, 'short' | 'detailed' | 'marine'>
  ), night: (
    { __typename?: 'ForecastDescription' }
    & Pick<ForecastDescription, 'short' | 'detailed' | 'marine'>
  ), temperature: Array<(
    { __typename?: 'TemperatureDetail' }
    & Pick<TemperatureDetail, 'timestamp'>
    & { temperature: (
      { __typename?: 'Temperature' }
      & Pick<Temperature, 'degrees'>
    ) }
  )>, rain: Array<(
    { __typename?: 'RainDetail' }
    & Pick<RainDetail, 'timestamp' | 'mmPerHour'>
  )> }
);

export type CurrentConditionsDataQueryVariables = {
  locationId: Scalars['ID'];
  usgsSiteId?: Maybe<Scalars['ID']>;
  includeUsgs: Scalars['Boolean'];
  noaaStationId?: Maybe<Scalars['ID']>;
  includeNoaa: Scalars['Boolean'];
  startDate: Scalars['String'];
  endDate: Scalars['String'];
};


export type CurrentConditionsDataQuery = (
  { __typename?: 'Query' }
  & { location?: Maybe<(
    { __typename?: 'Location' }
    & Pick<Location, 'id'>
    & { temperature: (
      { __typename?: 'TemperatureResult' }
      & TemperatureDetailFieldsFragment
    ) }
  )>, usgsSite?: Maybe<(
    { __typename?: 'UsgsSite' }
    & UsgsSiteDetailFieldsFragment
  )>, tidePreditionStation?: Maybe<(
    { __typename?: 'TidePreditionStation' }
    & TidePredictionStationDetailFieldsFragment
  )> }
);

export type TemperatureDetailFieldsFragment = (
  { __typename?: 'TemperatureResult' }
  & { summary: (
    { __typename?: 'TemperatureSummary' }
    & { mostRecent?: Maybe<(
      { __typename?: 'TemperatureDetail' }
      & { temperature: (
        { __typename?: 'Temperature' }
        & Pick<Temperature, 'degrees'>
      ) }
    )> }
  ), detail?: Maybe<Array<(
    { __typename?: 'TemperatureDetail' }
    & Pick<TemperatureDetail, 'timestamp'>
    & { temperature: (
      { __typename?: 'Temperature' }
      & Pick<Temperature, 'degrees'>
    ) }
  )>> }
);

export type WaterTemperatureDetailFieldsFragment = (
  { __typename?: 'WaterTemperature' }
  & { summary: (
    { __typename?: 'TemperatureSummary' }
    & { mostRecent?: Maybe<(
      { __typename?: 'TemperatureDetail' }
      & { temperature: (
        { __typename?: 'Temperature' }
        & Pick<Temperature, 'degrees'>
      ) }
    )> }
  ), detail?: Maybe<Array<(
    { __typename?: 'TemperatureDetail' }
    & Pick<TemperatureDetail, 'timestamp'>
    & { temperature: (
      { __typename?: 'Temperature' }
      & Pick<Temperature, 'degrees'>
    ) }
  )>> }
);

export type UsgsSiteDetailFieldsFragment = (
  { __typename?: 'UsgsSite' }
  & Pick<UsgsSite, 'id' | 'name'>
  & { salinity?: Maybe<(
    { __typename?: 'Salinity' }
    & { summary?: Maybe<(
      { __typename?: 'SalinitySummary' }
      & { mostRecent?: Maybe<(
        { __typename?: 'SalinityDetail' }
        & Pick<SalinityDetail, 'salinity'>
      )> }
    )>, detail?: Maybe<Array<(
      { __typename?: 'SalinityDetail' }
      & Pick<SalinityDetail, 'timestamp' | 'salinity'>
    )>> }
  )>, waterTemperature?: Maybe<(
    { __typename?: 'WaterTemperature' }
    & WaterTemperatureDetailFieldsFragment
  )>, wind?: Maybe<(
    { __typename?: 'Wind' }
    & { summary: (
      { __typename?: 'WindSummary' }
      & { mostRecent?: Maybe<(
        { __typename?: 'WindDetail' }
        & WindDetailFields2Fragment
      )> }
    ), detail?: Maybe<Array<(
      { __typename?: 'WindDetail' }
      & WindDetailFields2Fragment
    )>> }
  )> }
);

export type TidePredictionStationDetailFieldsFragment = (
  { __typename?: 'TidePreditionStation' }
  & Pick<TidePreditionStation, 'id' | 'name'>
  & { wind?: Maybe<(
    { __typename?: 'Wind' }
    & { summary: (
      { __typename?: 'WindSummary' }
      & { mostRecent?: Maybe<(
        { __typename?: 'WindDetail' }
        & WindDetailFields2Fragment
      )> }
    ), detail?: Maybe<Array<(
      { __typename?: 'WindDetail' }
      & WindDetailFields2Fragment
    )>> }
  )>, temperature?: Maybe<(
    { __typename?: 'TemperatureResult' }
    & TemperatureDetailFieldsFragment
  )>, waterTemperature?: Maybe<(
    { __typename?: 'WaterTemperature' }
    & WaterTemperatureDetailFieldsFragment
  )> }
);

export type WindDetailFields2Fragment = (
  { __typename?: 'WindDetail' }
  & Pick<WindDetail, 'timestamp' | 'speed' | 'direction' | 'directionDegrees'>
);

export type HourlyForecastQueryVariables = {
  locationId: Scalars['ID'];
};


export type HourlyForecastQuery = (
  { __typename?: 'Query' }
  & { location?: Maybe<(
    { __typename?: 'Location' }
    & Pick<Location, 'id'>
    & { hourlyWeatherForecast?: Maybe<Array<(
      { __typename?: 'WeatherForecast' }
      & HourlyForecastDetailFragment
    )>> }
  )> }
);

export type HourlyForecastDetailFragment = (
  { __typename?: 'WeatherForecast' }
  & Pick<WeatherForecast, 'startTime' | 'icon' | 'shortForecast'>
  & { temperature: (
    { __typename?: 'Temperature' }
    & Pick<Temperature, 'degrees' | 'unit'>
  ), windSpeed?: Maybe<(
    { __typename?: 'ForecastWindSpeedDetail' }
    & Pick<ForecastWindSpeedDetail, 'from' | 'to'>
  )>, windDirection?: Maybe<(
    { __typename?: 'WindDirection' }
    & Pick<WindDirection, 'text'>
  )> }
);

export type LocationsQueryVariables = {};


export type LocationsQuery = (
  { __typename?: 'Query' }
  & { locations: Array<(
    { __typename?: 'Location' }
    & LocationDetailFragment
  )> }
);

export type TideStationDetailFragment = (
  { __typename?: 'TidePreditionStation' }
  & Pick<TidePreditionStation, 'id' | 'name' | 'availableParams'>
);

export type UsgsSiteDetailFragment = (
  { __typename?: 'UsgsSite' }
  & Pick<UsgsSite, 'id' | 'name' | 'availableParams'>
);

export type LocationDetailFragment = (
  { __typename?: 'Location' }
  & Pick<Location, 'id' | 'name'>
  & { coords: (
    { __typename?: 'Coords' }
    & Pick<Coords, 'lat' | 'lon'>
  ), tidePreditionStations: Array<(
    { __typename?: 'TidePreditionStation' }
    & TideStationDetailFragment
  )>, usgsSites: Array<(
    { __typename?: 'UsgsSite' }
    & UsgsSiteDetailFragment
  )> }
);

export type MapsQueryVariables = {
  locationId: Scalars['ID'];
};


export type MapsQuery = (
  { __typename?: 'Query' }
  & { location?: Maybe<(
    { __typename?: 'Location' }
    & Pick<Location, 'id'>
    & { maps?: Maybe<(
      { __typename?: 'Maps' }
      & { radar: Array<(
        { __typename?: 'Map' }
        & Pick<Map, 'timestamp' | 'imageUrl'>
      )>, overlays: (
        { __typename?: 'Overlays' }
        & OverlayMapsFragment
      ) }
    )> }
  )> }
);

export type OverlayMapsFragment = (
  { __typename?: 'Overlays' }
  & Pick<Overlays, 'topo' | 'counties' | 'rivers' | 'highways' | 'cities'>
);

export type ModisMapQueryVariables = {
  locationId: Scalars['ID'];
};


export type ModisMapQuery = (
  { __typename?: 'Query' }
  & { location?: Maybe<(
    { __typename?: 'Location' }
    & Pick<Location, 'id'>
    & { modisMaps: Array<(
      { __typename?: 'ModisMap' }
      & Pick<ModisMap, 'date' | 'satellite'>
      & { small: (
        { __typename?: 'ModisMapEntry' }
        & Pick<ModisMapEntry, 'url' | 'width' | 'height'>
      ), large: (
        { __typename?: 'ModisMapEntry' }
        & Pick<ModisMapEntry, 'url' | 'width' | 'height'>
      ) }
    )> }
  )> }
);

export type SalinityMapQueryVariables = {
  locationId: Scalars['ID'];
};


export type SalinityMapQuery = (
  { __typename?: 'Query' }
  & { location?: Maybe<(
    { __typename?: 'Location' }
    & Pick<Location, 'id' | 'salinityMap'>
  )> }
);

export type TideQueryVariables = {
  locationId: Scalars['ID'];
  tideStationId: Scalars['ID'];
  usgsSiteId?: Maybe<Scalars['ID']>;
  includeUsgs: Scalars['Boolean'];
  noaaStationId?: Maybe<Scalars['ID']>;
  includeNoaa: Scalars['Boolean'];
  startDate: Scalars['String'];
  endDate: Scalars['String'];
};


export type TideQuery = (
  { __typename?: 'Query' }
  & { tidePreditionStation?: Maybe<(
    { __typename?: 'TidePreditionStation' }
    & Pick<TidePreditionStation, 'id'>
    & { tides?: Maybe<Array<(
      { __typename?: 'TideDetail' }
      & TideDetailFieldsFragment
    )>> }
  )>, usgsSite?: Maybe<(
    { __typename?: 'UsgsSite' }
    & UsgsSiteFieldsFragment
  )>, noaaWaterHeight?: Maybe<(
    { __typename?: 'TidePreditionStation' }
    & { waterHeight?: Maybe<Array<(
      { __typename?: 'WaterHeight' }
      & WaterHeightFieldsFragment
    )>> }
  )>, location?: Maybe<(
    { __typename?: 'Location' }
    & Pick<Location, 'id'>
    & { sun?: Maybe<Array<(
      { __typename?: 'SunDetail' }
      & SunDetailFieldsFragment
    )>>, moon?: Maybe<Array<(
      { __typename?: 'MoonDetail' }
      & MoonDetailFieldsFragment
    )>> }
  )> }
);

export type TideDetailFieldsFragment = (
  { __typename?: 'TideDetail' }
  & Pick<TideDetail, 'time' | 'height' | 'type'>
);

export type UsgsSiteFieldsFragment = (
  { __typename?: 'UsgsSite' }
  & Pick<UsgsSite, 'id' | 'name'>
  & { waterHeight?: Maybe<Array<(
    { __typename?: 'WaterHeight' }
    & WaterHeightFieldsFragment
  )>> }
);

export type WaterHeightFieldsFragment = (
  { __typename?: 'WaterHeight' }
  & Pick<WaterHeight, 'timestamp' | 'height'>
);

export type SunDetailFieldsFragment = (
  { __typename?: 'SunDetail' }
  & Pick<SunDetail, 'sunrise' | 'sunset' | 'dawn' | 'dusk' | 'nauticalDawn' | 'nauticalDusk'>
);

export type MoonDetailFieldsFragment = (
  { __typename?: 'MoonDetail' }
  & Pick<MoonDetail, 'date' | 'phase' | 'illumination'>
);

export const CombinedForecastV2DetailFragmentDoc = gql`
    fragment CombinedForecastV2Detail on CombinedForecastV2 {
  name
  date
  wind {
    timestamp
    base
    gusts
    direction {
      text
      degrees
    }
  }
  day {
    short
    detailed
    marine
  }
  night {
    short
    detailed
    marine
  }
  temperature {
    timestamp
    temperature {
      degrees
    }
  }
  rain {
    timestamp
    mmPerHour
  }
}
    `;
export const WaterTemperatureDetailFieldsFragmentDoc = gql`
    fragment WaterTemperatureDetailFields on WaterTemperature {
  summary {
    mostRecent {
      temperature {
        degrees
      }
    }
  }
  detail(start: $startDate, end: $endDate) {
    timestamp
    temperature {
      degrees
    }
  }
}
    `;
export const WindDetailFields2FragmentDoc = gql`
    fragment WindDetailFields2 on WindDetail {
  timestamp
  speed
  direction
  directionDegrees
}
    `;
export const UsgsSiteDetailFieldsFragmentDoc = gql`
    fragment UsgsSiteDetailFields on UsgsSite {
  id
  name
  salinity {
    summary {
      mostRecent {
        salinity
      }
    }
    detail(start: $startDate, end: $endDate) {
      timestamp
      salinity
    }
  }
  waterTemperature {
    ...WaterTemperatureDetailFields
  }
  wind {
    summary {
      mostRecent {
        ...WindDetailFields2
      }
    }
    detail(start: $startDate, end: $endDate) {
      ...WindDetailFields2
    }
  }
}
    ${WaterTemperatureDetailFieldsFragmentDoc}
${WindDetailFields2FragmentDoc}`;
export const TemperatureDetailFieldsFragmentDoc = gql`
    fragment TemperatureDetailFields on TemperatureResult {
  summary {
    mostRecent {
      temperature {
        degrees
      }
    }
  }
  detail(start: $startDate, end: $endDate) {
    timestamp
    temperature {
      degrees
    }
  }
}
    `;
export const TidePredictionStationDetailFieldsFragmentDoc = gql`
    fragment TidePredictionStationDetailFields on TidePreditionStation {
  id
  name
  wind {
    summary {
      mostRecent {
        ...WindDetailFields2
      }
    }
    detail(start: $startDate, end: $endDate) {
      ...WindDetailFields2
    }
  }
  temperature {
    ...TemperatureDetailFields
  }
  waterTemperature {
    ...WaterTemperatureDetailFields
  }
}
    ${WindDetailFields2FragmentDoc}
${TemperatureDetailFieldsFragmentDoc}
${WaterTemperatureDetailFieldsFragmentDoc}`;
export const HourlyForecastDetailFragmentDoc = gql`
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
export const TideStationDetailFragmentDoc = gql`
    fragment TideStationDetail on TidePreditionStation {
  id
  name
  availableParams
}
    `;
export const UsgsSiteDetailFragmentDoc = gql`
    fragment UsgsSiteDetail on UsgsSite {
  id
  name
  availableParams
}
    `;
export const LocationDetailFragmentDoc = gql`
    fragment LocationDetail on Location {
  id
  name
  coords {
    lat
    lon
  }
  tidePreditionStations {
    ...TideStationDetail
  }
  usgsSites {
    ...UsgsSiteDetail
  }
}
    ${TideStationDetailFragmentDoc}
${UsgsSiteDetailFragmentDoc}`;
export const OverlayMapsFragmentDoc = gql`
    fragment OverlayMaps on Overlays {
  topo
  counties
  rivers
  highways
  cities
}
    `;
export const TideDetailFieldsFragmentDoc = gql`
    fragment TideDetailFields on TideDetail {
  time
  height
  type
}
    `;
export const WaterHeightFieldsFragmentDoc = gql`
    fragment WaterHeightFields on WaterHeight {
  timestamp
  height
}
    `;
export const UsgsSiteFieldsFragmentDoc = gql`
    fragment UsgsSiteFields on UsgsSite {
  id
  name
  waterHeight(start: $startDate, end: $endDate) {
    ...WaterHeightFields
  }
}
    ${WaterHeightFieldsFragmentDoc}`;
export const SunDetailFieldsFragmentDoc = gql`
    fragment SunDetailFields on SunDetail {
  sunrise
  sunset
  dawn
  dusk
  nauticalDawn
  nauticalDusk
}
    `;
export const MoonDetailFieldsFragmentDoc = gql`
    fragment MoonDetailFields on MoonDetail {
  date
  phase
  illumination
}
    `;
export const CombinedForecastV2Document = gql`
    query CombinedForecastV2($locationId: ID!, $startDate: String!, $endDate: String!) {
  location(id: $locationId) {
    id
    combinedForecastV2(start: $startDate, end: $endDate) {
      ...CombinedForecastV2Detail
    }
    tidePreditionStations(limit: 1) {
      id
      name
      tides(start: $startDate, end: $endDate) {
        ...TideDetailFields
      }
    }
    sun(start: $startDate, end: $endDate) {
      ...SunDetailFields
    }
  }
}
    ${CombinedForecastV2DetailFragmentDoc}
${TideDetailFieldsFragmentDoc}
${SunDetailFieldsFragmentDoc}`;

export function useCombinedForecastV2Query(options: Omit<Urql.UseQueryArgs<CombinedForecastV2QueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CombinedForecastV2Query>({ query: CombinedForecastV2Document, ...options });
};
export const CurrentConditionsDataDocument = gql`
    query CurrentConditionsData($locationId: ID!, $usgsSiteId: ID, $includeUsgs: Boolean!, $noaaStationId: ID, $includeNoaa: Boolean!, $startDate: String!, $endDate: String!) {
  location(id: $locationId) {
    id
    temperature {
      ...TemperatureDetailFields
    }
  }
  usgsSite(siteId: $usgsSiteId) @include(if: $includeUsgs) {
    ...UsgsSiteDetailFields
  }
  tidePreditionStation(stationId: $noaaStationId) @include(if: $includeNoaa) {
    ...TidePredictionStationDetailFields
  }
}
    ${TemperatureDetailFieldsFragmentDoc}
${UsgsSiteDetailFieldsFragmentDoc}
${TidePredictionStationDetailFieldsFragmentDoc}`;

export function useCurrentConditionsDataQuery(options: Omit<Urql.UseQueryArgs<CurrentConditionsDataQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CurrentConditionsDataQuery>({ query: CurrentConditionsDataDocument, ...options });
};
export const HourlyForecastDocument = gql`
    query HourlyForecast($locationId: ID!) {
  location(id: $locationId) {
    id
    hourlyWeatherForecast {
      ...HourlyForecastDetail
    }
  }
}
    ${HourlyForecastDetailFragmentDoc}`;

export function useHourlyForecastQuery(options: Omit<Urql.UseQueryArgs<HourlyForecastQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<HourlyForecastQuery>({ query: HourlyForecastDocument, ...options });
};
export const LocationsDocument = gql`
    query Locations {
  locations {
    ...LocationDetail
  }
}
    ${LocationDetailFragmentDoc}`;

export function useLocationsQuery(options: Omit<Urql.UseQueryArgs<LocationsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<LocationsQuery>({ query: LocationsDocument, ...options });
};
export const MapsDocument = gql`
    query Maps($locationId: ID!) {
  location(id: $locationId) {
    id
    maps {
      radar(numImages: 8) {
        timestamp
        imageUrl
      }
      overlays {
        ...OverlayMaps
      }
    }
  }
}
    ${OverlayMapsFragmentDoc}`;

export function useMapsQuery(options: Omit<Urql.UseQueryArgs<MapsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MapsQuery>({ query: MapsDocument, ...options });
};
export const ModisMapDocument = gql`
    query ModisMap($locationId: ID!) {
  location(id: $locationId) {
    id
    modisMaps(numDays: 8) {
      date
      satellite
      small {
        url
        width
        height
      }
      large {
        url
        width
        height
      }
    }
  }
}
    `;

export function useModisMapQuery(options: Omit<Urql.UseQueryArgs<ModisMapQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ModisMapQuery>({ query: ModisMapDocument, ...options });
};
export const SalinityMapDocument = gql`
    query SalinityMap($locationId: ID!) {
  location(id: $locationId) {
    id
    salinityMap
  }
}
    `;

export function useSalinityMapQuery(options: Omit<Urql.UseQueryArgs<SalinityMapQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SalinityMapQuery>({ query: SalinityMapDocument, ...options });
};
export const TideDocument = gql`
    query Tide($locationId: ID!, $tideStationId: ID!, $usgsSiteId: ID, $includeUsgs: Boolean!, $noaaStationId: ID, $includeNoaa: Boolean!, $startDate: String!, $endDate: String!) {
  tidePreditionStation(stationId: $tideStationId) {
    id
    tides(start: $startDate, end: $endDate) {
      ...TideDetailFields
    }
  }
  usgsSite(siteId: $usgsSiteId) @include(if: $includeUsgs) {
    ...UsgsSiteFields
  }
  noaaWaterHeight: tidePreditionStation(stationId: $noaaStationId) @include(if: $includeNoaa) {
    waterHeight(start: $startDate, end: $endDate) {
      ...WaterHeightFields
    }
  }
  location(id: $locationId) {
    id
    sun(start: $startDate, end: $endDate) {
      ...SunDetailFields
    }
    moon(start: $startDate, end: $endDate) {
      ...MoonDetailFields
    }
  }
}
    ${TideDetailFieldsFragmentDoc}
${UsgsSiteFieldsFragmentDoc}
${WaterHeightFieldsFragmentDoc}
${SunDetailFieldsFragmentDoc}
${MoonDetailFieldsFragmentDoc}`;

export function useTideQuery(options: Omit<Urql.UseQueryArgs<TideQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TideQuery>({ query: TideDocument, ...options });
};
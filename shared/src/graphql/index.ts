import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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

export type CombinedForecastQueryVariables = {
  locationId: Scalars['ID']
};


export type CombinedForecastQuery = ({ __typename?: 'Query' } & { location: Maybe<({ __typename?: 'Location' } & { combinedForecast: Maybe<Array<({ __typename?: 'CombinedForecast' } & CombinedForecastDetailFragment)>>, hourlyWeatherForecast: Maybe<Array<({ __typename?: 'WeatherForecast' } & HourlyForecastDetailFragment)>> })> });

export type HourlyForecastDetailFragment = ({ __typename?: 'WeatherForecast' } & Pick<WeatherForecast, 'startTime' | 'icon' | 'shortForecast'> & { temperature: ({ __typename?: 'Temperature' } & Pick<Temperature, 'degrees' | 'unit'>), windSpeed: Maybe<({ __typename?: 'ForecastWindSpeedDetail' } & Pick<ForecastWindSpeedDetail, 'from' | 'to'>)>, windDirection: Maybe<({ __typename?: 'WindDirection' } & Pick<WindDirection, 'text'>)> });

export type CombinedForecastDetailFragment = ({ __typename?: 'CombinedForecast' } & Pick<CombinedForecast, 'timePeriod' | 'chanceOfPrecipitation' | 'icon' | 'marine' | 'short' | 'detailed'> & { wind: ({ __typename?: 'WindForecast' } & { speed: Maybe<({ __typename?: 'ForecastWindSpeedDetail' } & Pick<ForecastWindSpeedDetail, 'from' | 'to'>)>, direction: Maybe<({ __typename?: 'WindDirection' } & Pick<WindDirection, 'text' | 'degrees'>)> }), waterCondition: Maybe<({ __typename?: 'WaterCondition' } & Pick<WaterCondition, 'text' | 'icon'>)>, temperature: ({ __typename?: 'Temperature' } & Pick<Temperature, 'degrees' | 'unit'>) });

export type CurrentConditionsDataQueryVariables = {
  locationId: Scalars['ID'],
  usgsSiteId?: Maybe<Scalars['ID']>,
  startDate: Scalars['String'],
  endDate: Scalars['String']
};


export type CurrentConditionsDataQuery = ({ __typename?: 'Query' } & { location: Maybe<({ __typename?: 'Location' } & { wind: Maybe<({ __typename?: 'Wind' } & { summary: ({ __typename?: 'WindSummary' } & { mostRecent: Maybe<({ __typename?: 'WindDetail' } & WindDetailFields2Fragment)> }), detail: Maybe<Array<({ __typename?: 'WindDetail' } & WindDetailFields2Fragment)>> })>, temperature: ({ __typename?: 'TemperatureResult' } & { summary: ({ __typename?: 'TemperatureSummary' } & { mostRecent: ({ __typename?: 'TemperatureDetail' } & { temperature: ({ __typename?: 'Temperature' } & Pick<Temperature, 'degrees'>) }) }), detail: Maybe<Array<({ __typename?: 'TemperatureDetail' } & Pick<TemperatureDetail, 'timestamp'> & { temperature: ({ __typename?: 'Temperature' } & Pick<Temperature, 'degrees'>) })>> }) })>, usgsSite: Maybe<({ __typename?: 'UsgsSite' } & UsgsSiteDetailFieldsFragment)> });

export type UsgsSiteDetailFieldsFragment = ({ __typename?: 'UsgsSite' } & Pick<UsgsSite, 'id' | 'name'> & { salinity: Maybe<({ __typename?: 'Salinity' } & { summary: Maybe<({ __typename?: 'SalinitySummary' } & { mostRecent: Maybe<({ __typename?: 'SalinityDetail' } & Pick<SalinityDetail, 'salinity'>)> })>, detail: Maybe<Array<({ __typename?: 'SalinityDetail' } & Pick<SalinityDetail, 'timestamp' | 'salinity'>)>> })>, waterTemperature: Maybe<({ __typename?: 'WaterTemperature' } & { summary: ({ __typename?: 'WaterTemperatureSummary' } & { mostRecent: Maybe<({ __typename?: 'TemperatureDetail' } & Pick<TemperatureDetail, 'timestamp'> & { temperature: ({ __typename?: 'Temperature' } & Pick<Temperature, 'degrees'>) })> }), detail: Maybe<Array<({ __typename?: 'TemperatureDetail' } & Pick<TemperatureDetail, 'timestamp'> & { temperature: ({ __typename?: 'Temperature' } & Pick<Temperature, 'degrees'>) })>> })> });

export type WindDetailFields2Fragment = ({ __typename?: 'WindDetail' } & Pick<WindDetail, 'timestamp' | 'speed' | 'direction' | 'directionDegrees'>);

export type ForecastQueryVariables = {
  locationId: Scalars['ID']
};


export type ForecastQuery = ({ __typename?: 'Query' } & { location: Maybe<({ __typename?: 'Location' } & { marineForecast: Maybe<Array<({ __typename?: 'MarineForecast' } & Pick<MarineForecast, 'timePeriod'> & { forecast: ({ __typename?: 'MarineForecastDetail' } & Pick<MarineForecastDetail, 'text'>) })>>, weatherForecast: Maybe<Array<({ __typename?: 'WeatherForecast' } & Pick<WeatherForecast, 'name' | 'icon' | 'shortForecast' | 'detailedForecast'> & { temperature: ({ __typename?: 'Temperature' } & Pick<Temperature, 'degrees' | 'unit'>), windSpeed: Maybe<({ __typename?: 'ForecastWindSpeedDetail' } & Pick<ForecastWindSpeedDetail, 'to' | 'from'>)>, windDirection: Maybe<({ __typename?: 'WindDirection' } & Pick<WindDirection, 'text'>)> })>> })> });

export type LocationsQueryVariables = {};


export type LocationsQuery = ({ __typename?: 'Query' } & { locations: Array<({ __typename?: 'Location' } & LocationDetailFragment)> });

export type TideStationDetailFragment = ({ __typename?: 'TidePreditionStation' } & Pick<TidePreditionStation, 'id' | 'name'>);

export type UsgsSiteDetailFragment = ({ __typename?: 'UsgsSite' } & Pick<UsgsSite, 'id' | 'name' | 'availableParams'>);

export type LocationDetailFragment = ({ __typename?: 'Location' } & Pick<Location, 'id' | 'name'> & { coords: ({ __typename?: 'Coords' } & Pick<Coords, 'lat' | 'lon'>), tidePreditionStations: Array<({ __typename?: 'TidePreditionStation' } & TideStationDetailFragment)>, usgsSites: Array<({ __typename?: 'UsgsSite' } & UsgsSiteDetailFragment)> });

export type MapsQueryVariables = {
  locationId: Scalars['ID']
};


export type MapsQuery = ({ __typename?: 'Query' } & { location: Maybe<({ __typename?: 'Location' } & { maps: Maybe<({ __typename?: 'Maps' } & { radar: Array<({ __typename?: 'Map' } & Pick<Map, 'timestamp' | 'imageUrl'>)>, overlays: ({ __typename?: 'Overlays' } & OverlayMapsFragment) })> })> });

export type OverlayMapsFragment = ({ __typename?: 'Overlays' } & Pick<Overlays, 'topo' | 'counties' | 'rivers' | 'highways' | 'cities'>);

export type ModisMapQueryVariables = {
  locationId: Scalars['ID']
};


export type ModisMapQuery = ({ __typename?: 'Query' } & { location: Maybe<({ __typename?: 'Location' } & { modisMaps: Array<({ __typename?: 'ModisMap' } & Pick<ModisMap, 'date' | 'satellite'> & { small: ({ __typename?: 'ModisMapEntry' } & Pick<ModisMapEntry, 'url' | 'width' | 'height'>), large: ({ __typename?: 'ModisMapEntry' } & Pick<ModisMapEntry, 'url' | 'width' | 'height'>) })> })> });

export type SalinityMapQueryVariables = {
  locationId: Scalars['ID']
};


export type SalinityMapQuery = ({ __typename?: 'Query' } & { location: Maybe<({ __typename?: 'Location' } & Pick<Location, 'salinityMap'>)> });

export type TideQueryVariables = {
  locationId: Scalars['ID'],
  tideStationId: Scalars['ID'],
  usgsSiteId: Scalars['ID'],
  startDate: Scalars['String'],
  endDate: Scalars['String']
};


export type TideQuery = ({ __typename?: 'Query' } & { tidePreditionStation: Maybe<({ __typename?: 'TidePreditionStation' } & { tides: Maybe<Array<({ __typename?: 'TideDetail' } & TideDetailFieldsFragment)>> })>, usgsSite: Maybe<({ __typename?: 'UsgsSite' } & UsgsSiteFieldsFragment)>, location: Maybe<({ __typename?: 'Location' } & { sun: Maybe<Array<({ __typename?: 'SunDetail' } & SunDetailFieldsFragment)>>, moon: Maybe<Array<({ __typename?: 'MoonDetail' } & MoonDetailFieldsFragment)>> })> });

export type TideDetailFieldsFragment = ({ __typename?: 'TideDetail' } & Pick<TideDetail, 'time' | 'height' | 'type'>);

export type UsgsSiteFieldsFragment = ({ __typename?: 'UsgsSite' } & Pick<UsgsSite, 'id' | 'name'> & { waterHeight: Maybe<Array<({ __typename?: 'WaterHeight' } & WaterHeightFieldsFragment)>> });

export type WaterHeightFieldsFragment = ({ __typename?: 'WaterHeight' } & Pick<WaterHeight, 'timestamp' | 'height'>);

export type SunDetailFieldsFragment = ({ __typename?: 'SunDetail' } & Pick<SunDetail, 'sunrise' | 'sunset' | 'dawn' | 'dusk' | 'nauticalDawn' | 'nauticalDusk'>);

export type MoonDetailFieldsFragment = ({ __typename?: 'MoonDetail' } & Pick<MoonDetail, 'date' | 'phase' | 'illumination'>);

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
export const CombinedForecastDetailFragmentDoc = gql`
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
export const UsgsSiteDetailFieldsFragmentDoc = gql`
    fragment UsgsSiteDetailFields on UsgsSite {
  id
  name
  salinity(start: $startDate, end: $endDate) {
    summary {
      mostRecent {
        salinity
      }
    }
    detail {
      timestamp
      salinity
    }
  }
  waterTemperature {
    summary {
      mostRecent {
        timestamp
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
export const TideStationDetailFragmentDoc = gql`
    fragment TideStationDetail on TidePreditionStation {
  id
  name
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
export const CombinedForecastDocument = gql`
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
    ${CombinedForecastDetailFragmentDoc}
${HourlyForecastDetailFragmentDoc}`;

export function useCombinedForecastQuery(options: Omit<Urql.UseQueryArgs<CombinedForecastQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CombinedForecastQuery>({ query: CombinedForecastDocument, ...options });
};
export const CurrentConditionsDataDocument = gql`
    query CurrentConditionsData($locationId: ID!, $usgsSiteId: ID, $startDate: String!, $endDate: String!) {
  location(id: $locationId) {
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
  }
  usgsSite(siteId: $usgsSiteId) {
    ...UsgsSiteDetailFields
  }
}
    ${WindDetailFields2FragmentDoc}
${UsgsSiteDetailFieldsFragmentDoc}`;

export function useCurrentConditionsDataQuery(options: Omit<Urql.UseQueryArgs<CurrentConditionsDataQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CurrentConditionsDataQuery>({ query: CurrentConditionsDataDocument, ...options });
};
export const ForecastDocument = gql`
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

export function useForecastQuery(options: Omit<Urql.UseQueryArgs<ForecastQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ForecastQuery>({ query: ForecastDocument, ...options });
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
    salinityMap
  }
}
    `;

export function useSalinityMapQuery(options: Omit<Urql.UseQueryArgs<SalinityMapQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SalinityMapQuery>({ query: SalinityMapDocument, ...options });
};
export const TideDocument = gql`
    query Tide($locationId: ID!, $tideStationId: ID!, $usgsSiteId: ID!, $startDate: String!, $endDate: String!) {
  tidePreditionStation(stationId: $tideStationId) {
    tides(start: $startDate, end: $endDate) {
      ...TideDetailFields
    }
  }
  usgsSite(siteId: $usgsSiteId) {
    ...UsgsSiteFields
  }
  location(id: $locationId) {
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
${SunDetailFieldsFragmentDoc}
${MoonDetailFieldsFragmentDoc}`;

export function useTideQuery(options: Omit<Urql.UseQueryArgs<TideQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TideQuery>({ query: TideDocument, ...options });
};
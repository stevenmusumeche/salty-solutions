import gql from "graphql-tag";
import * as Urql from "urql";
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

export type CurrentWind = {
  __typename?: "CurrentWind";
  speed: Scalars["Float"];
  direction: Scalars["String"];
  directionDegrees: Scalars["Float"];
};

export type Location = {
  __typename?: "Location";
  id: Scalars["ID"];
  name: Scalars["String"];
  tidePreditionStations: Array<TidePreditionStation>;
  lat: Scalars["Float"];
  long: Scalars["Float"];
  sun?: Maybe<Array<SunDetail>>;
  moon?: Maybe<Array<MoonDetail>>;
  weatherForecast?: Maybe<Array<WeatherForecast>>;
  hourlyWeatherForecast?: Maybe<Array<WeatherForecast>>;
  marineForecast?: Maybe<Array<MarineForecast>>;
  waterHeight?: Maybe<Array<WaterHeight>>;
  waterTemperature: WaterTemperature;
  wind: Wind;
  salinity: Salinity;
  temperature: Temperature;
  maps?: Maybe<Maps>;
};

export type LocationSunArgs = {
  start: Scalars["String"];
  end: Scalars["String"];
};

export type LocationMoonArgs = {
  start: Scalars["String"];
  end: Scalars["String"];
};

export type LocationWaterHeightArgs = {
  numDays?: Maybe<Scalars["Int"]>;
};

export type LocationWaterTemperatureArgs = {
  numDays?: Maybe<Scalars["Int"]>;
};

export type LocationSalinityArgs = {
  numHours?: Maybe<Scalars["Int"]>;
};

export type Map = {
  __typename?: "Map";
  imageUrl: Scalars["String"];
  timestamp: Scalars["String"];
};

export type Maps = {
  __typename?: "Maps";
  radar: Array<Map>;
  overlays: Overlays;
};

export type MapsRadarArgs = {
  numImages?: Maybe<Scalars["Int"]>;
};

export type MarineForecast = {
  __typename?: "MarineForecast";
  timePeriod: Scalars["String"];
  forecast: Scalars["String"];
};

export type MoonDetail = {
  __typename?: "MoonDetail";
  date: Scalars["String"];
  phase: Scalars["String"];
  illumination: Scalars["Int"];
};

export type Overlays = {
  __typename?: "Overlays";
  topo: Scalars["String"];
  counties: Scalars["String"];
  rivers: Scalars["String"];
  highways: Scalars["String"];
  cities: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  locations: Array<Location>;
  location?: Maybe<Location>;
};

export type QueryLocationArgs = {
  id: Scalars["ID"];
};

export type Salinity = {
  __typename?: "Salinity";
  summary?: Maybe<SalinitySummary>;
  detail?: Maybe<Array<SalinityDetail>>;
};

export type SalinityDetail = {
  __typename?: "SalinityDetail";
  timestamp: Scalars["String"];
  /** parts per thousand */
  salinity: Scalars["Float"];
};

export type SalinitySummary = {
  __typename?: "SalinitySummary";
  /** parts per thousand */
  mostRecent?: Maybe<SalinityDetail>;
};

export type SunDetail = {
  __typename?: "SunDetail";
  date: Scalars["String"];
  sunrise: Scalars["String"];
  sunset: Scalars["String"];
  dawn: Scalars["String"];
  dusk: Scalars["String"];
  nauticalDawn: Scalars["String"];
  nauticalDusk: Scalars["String"];
};

export type Temperature = {
  __typename?: "Temperature";
  summary: TemperatureSummary;
  detail?: Maybe<Array<TemperatureDetail>>;
};

export type TemperatureDetailArgs = {
  numHours?: Maybe<Scalars["Int"]>;
};

export type TemperatureDetail = {
  __typename?: "TemperatureDetail";
  timestamp: Scalars["String"];
  /** fahrenheit */
  temperature: Scalars["Float"];
};

export type TemperatureSummary = {
  __typename?: "TemperatureSummary";
  mostRecent: Scalars["Float"];
};

export type TideDetail = {
  __typename?: "TideDetail";
  time: Scalars["String"];
  height: Scalars["Float"];
  type: Scalars["String"];
};

export type TidePreditionStation = {
  __typename?: "TidePreditionStation";
  id: Scalars["ID"];
  name: Scalars["String"];
  url: Scalars["String"];
  lat: Scalars["Float"];
  long: Scalars["Float"];
  tides?: Maybe<Array<TideDetail>>;
};

export type TidePreditionStationTidesArgs = {
  start: Scalars["String"];
  end: Scalars["String"];
};

export type WaterHeight = {
  __typename?: "WaterHeight";
  timestamp: Scalars["String"];
  /** measured in feet */
  height: Scalars["Float"];
};

export type WaterTemperature = {
  __typename?: "WaterTemperature";
  summary: WaterTemperatureSummary;
  detail?: Maybe<Array<TemperatureDetail>>;
};

export type WaterTemperatureDetailArgs = {
  numHours?: Maybe<Scalars["Int"]>;
};

export type WaterTemperatureSummary = {
  __typename?: "WaterTemperatureSummary";
  mostRecent?: Maybe<TemperatureDetail>;
};

export type WeatherForecast = {
  __typename?: "WeatherForecast";
  name: Scalars["String"];
  startTime: Scalars["String"];
  endTime: Scalars["String"];
  isDaytime: Scalars["Boolean"];
  temperature: Scalars["Int"];
  temperatureUnit: Scalars["String"];
  windSpeed?: Maybe<Scalars["String"]>;
  windDirection?: Maybe<Scalars["String"]>;
  icon: Scalars["String"];
  shortForecast: Scalars["String"];
  detailedForecast: Scalars["String"];
};

export type Wind = {
  __typename?: "Wind";
  summary: WindSummary;
  detail?: Maybe<Array<WindDetail>>;
};

export type WindDetailArgs = {
  numHours?: Maybe<Scalars["Int"]>;
};

export type WindDetail = {
  __typename?: "WindDetail";
  timestamp: Scalars["String"];
  /** miles per hour */
  speed: Scalars["Float"];
  direction: Scalars["String"];
  directionDegrees: Scalars["Float"];
};

export type WindSummary = {
  __typename?: "WindSummary";
  mostRecent?: Maybe<WindDetail>;
};
export type ForecastQueryVariables = {
  locationId: Scalars["ID"];
};

export type ForecastQuery = { __typename?: "Query" } & {
  location: Maybe<
    { __typename?: "Location" } & {
      marineForecast: Maybe<
        Array<
          { __typename?: "MarineForecast" } & Pick<
            MarineForecast,
            "timePeriod" | "forecast"
          >
        >
      >;
      weatherForecast: Maybe<
        Array<
          { __typename?: "WeatherForecast" } & Pick<
            WeatherForecast,
            | "name"
            | "temperature"
            | "temperatureUnit"
            | "windSpeed"
            | "windDirection"
            | "icon"
            | "shortForecast"
            | "detailedForecast"
          >
        >
      >;
    }
  >;
};

export type LocationsQueryVariables = {};

export type LocationsQuery = { __typename?: "Query" } & {
  locations: Array<{ __typename?: "Location" } & Pick<Location, "id" | "name">>;
};

export type MapsQueryVariables = {
  locationId: Scalars["ID"];
};

export type MapsQuery = { __typename?: "Query" } & {
  location: Maybe<
    { __typename?: "Location" } & {
      maps: Maybe<
        { __typename?: "Maps" } & {
          radar: Array<
            { __typename?: "Map" } & Pick<Map, "timestamp" | "imageUrl">
          >;
          overlays: { __typename?: "Overlays" } & OverlayMapsFragment;
        }
      >;
    }
  >;
};

export type OverlayMapsFragment = { __typename?: "Overlays" } & Pick<
  Overlays,
  "topo" | "counties" | "rivers" | "highways" | "cities"
>;

export type SalinityQueryVariables = {};

export type SalinityQuery = { __typename?: "Query" } & {
  location: Maybe<
    { __typename?: "Location" } & {
      salinitySummary: { __typename?: "Salinity" } & {
        summary: Maybe<
          { __typename?: "SalinitySummary" } & {
            mostRecent: Maybe<
              { __typename?: "SalinityDetail" } & Pick<
                SalinityDetail,
                "salinity"
              >
            >;
          }
        >;
      };
    }
  >;
  detail: Maybe<
    { __typename?: "Location" } & {
      salinityDetail: { __typename?: "Salinity" } & {
        detail: Maybe<
          Array<
            { __typename?: "SalinityDetail" } & Pick<
              SalinityDetail,
              "timestamp" | "salinity"
            >
          >
        >;
      };
    }
  >;
};

export type CurrentTemperatureQueryVariables = {
  locationId: Scalars["ID"];
};

export type CurrentTemperatureQuery = { __typename?: "Query" } & {
  location: Maybe<
    { __typename?: "Location" } & {
      temperature: { __typename?: "Temperature" } & {
        summary: { __typename?: "TemperatureSummary" } & Pick<
          TemperatureSummary,
          "mostRecent"
        >;
        detail: Maybe<
          Array<
            { __typename?: "TemperatureDetail" } & Pick<
              TemperatureDetail,
              "timestamp" | "temperature"
            >
          >
        >;
      };
    }
  >;
};

export type CurrentWaterTemperatureQueryVariables = {};

export type CurrentWaterTemperatureQuery = { __typename?: "Query" } & {
  location: Maybe<
    { __typename?: "Location" } & {
      waterTemperature: { __typename?: "WaterTemperature" } & {
        summary: { __typename?: "WaterTemperatureSummary" } & {
          mostRecent: Maybe<
            { __typename?: "TemperatureDetail" } & Pick<
              TemperatureDetail,
              "timestamp" | "temperature"
            >
          >;
        };
        detail: Maybe<
          Array<
            { __typename?: "TemperatureDetail" } & Pick<
              TemperatureDetail,
              "timestamp" | "temperature"
            >
          >
        >;
      };
    }
  >;
};

export type WindDataQueryVariables = {
  locationId: Scalars["ID"];
};

export type WindDataQuery = { __typename?: "Query" } & {
  location: Maybe<
    { __typename?: "Location" } & {
      wind: { __typename?: "Wind" } & {
        summary: { __typename?: "WindSummary" } & {
          mostRecent: Maybe<
            { __typename?: "WindDetail" } & WindDetailFieldsFragment
          >;
        };
        detail: Maybe<
          Array<{ __typename?: "WindDetail" } & WindDetailFieldsFragment>
        >;
      };
    }
  >;
};

export type WindDetailFieldsFragment = { __typename?: "WindDetail" } & Pick<
  WindDetail,
  "timestamp" | "speed" | "direction" | "directionDegrees"
>;
export const OverlayMapsFragmentDoc = gql`
  fragment OverlayMaps on Overlays {
    topo
    counties
    rivers
    highways
    cities
  }
`;
export const WindDetailFieldsFragmentDoc = gql`
  fragment WindDetailFields on WindDetail {
    timestamp
    speed
    direction
    directionDegrees
  }
`;
export const ForecastDocument = gql`
  query Forecast($locationId: ID!) {
    location(id: $locationId) {
      marineForecast {
        timePeriod
        forecast
      }
      weatherForecast {
        name
        temperature
        temperatureUnit
        windSpeed
        windDirection
        icon
        shortForecast
        detailedForecast
      }
    }
  }
`;

export function useForecastQuery(
  options: Omit<Urql.UseQueryArgs<ForecastQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<ForecastQuery>({ query: ForecastDocument, ...options });
}
export const LocationsDocument = gql`
  query Locations {
    locations {
      id
      name
    }
  }
`;

export function useLocationsQuery(
  options: Omit<Urql.UseQueryArgs<LocationsQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<LocationsQuery>({
    query: LocationsDocument,
    ...options
  });
}
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
  ${OverlayMapsFragmentDoc}
`;

export function useMapsQuery(
  options: Omit<Urql.UseQueryArgs<MapsQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<MapsQuery>({ query: MapsDocument, ...options });
}
export const SalinityDocument = gql`
  query Salinity {
    location(id: "2") {
      salinitySummary: salinity(numHours: 12) {
        summary {
          mostRecent {
            salinity
          }
        }
      }
    }
    detail: location(id: "2") {
      salinityDetail: salinity(numHours: 48) {
        detail {
          timestamp
          salinity
        }
      }
    }
  }
`;

export function useSalinityQuery(
  options: Omit<Urql.UseQueryArgs<SalinityQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<SalinityQuery>({ query: SalinityDocument, ...options });
}
export const CurrentTemperatureDocument = gql`
  query CurrentTemperature($locationId: ID!) {
    location(id: $locationId) {
      temperature {
        summary {
          mostRecent
        }
        detail(numHours: 48) {
          timestamp
          temperature
        }
      }
    }
  }
`;

export function useCurrentTemperatureQuery(
  options: Omit<
    Urql.UseQueryArgs<CurrentTemperatureQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<CurrentTemperatureQuery>({
    query: CurrentTemperatureDocument,
    ...options
  });
}
export const CurrentWaterTemperatureDocument = gql`
  query CurrentWaterTemperature {
    location(id: "2") {
      waterTemperature {
        summary {
          mostRecent {
            timestamp
            temperature
          }
        }
        detail(numHours: 48) {
          timestamp
          temperature
        }
      }
    }
  }
`;

export function useCurrentWaterTemperatureQuery(
  options: Omit<
    Urql.UseQueryArgs<CurrentWaterTemperatureQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<CurrentWaterTemperatureQuery>({
    query: CurrentWaterTemperatureDocument,
    ...options
  });
}
export const WindDataDocument = gql`
  query WindData($locationId: ID!) {
    location(id: $locationId) {
      wind {
        summary {
          mostRecent {
            ...WindDetailFields
          }
        }
        detail(numHours: 48) {
          ...WindDetailFields
        }
      }
    }
  }
  ${WindDetailFieldsFragmentDoc}
`;

export function useWindDataQuery(
  options: Omit<Urql.UseQueryArgs<WindDataQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<WindDataQuery>({ query: WindDataDocument, ...options });
}

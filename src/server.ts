import Koa from "koa";
import { ApolloServer, gql } from "apollo-server-koa";
import * as tideService from "./services/tide";
import * as locationService from "./services/location";
import * as sunMoonService from "./services/sun-and-moon";
import * as weatherService from "./services/weather";

const typeDefs = gql`
  type Query {
    locations: [Location!]!
    location(id: ID!): Location
  }

  type Location {
    id: ID!
    name: String!
    tidePreditionStations: [TidePreditionStation!]!
    lat: Float!
    long: Float!
    marineZoneId: String!
    sun(start: String!, end: String!): [SunDetail!]!
    moon(start: String!, end: String!): [MoonDetail!]!
    weatherForecast: [WeatherForecast!]!
    hourlyWeatherForecast: [WeatherForecast!]!
  }

  type TidePreditionStation {
    id: ID!
    name: String!
    url: String!
    lat: Float!
    long: Float!
    tides(start: String!, end: String!): [TideDetail!]!
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
    windSpeed: String!
    windDirection: String!
    icon: String!
    shortForecast: String!
    detailedForecast: String!
  }
`;

const resolvers = {
  Query: {
    locations: (_: any, __: any, { services }: any) => {
      return services.location.getAll();
    },
    location: (_: any, args: any, { services }: any) => {
      return services.location.getById(args.id);
    }
  },
  Location: {
    tidePreditionStations: (location: any, __: any, { services }: any) => {
      return location.tideStationIds.map((id: string) =>
        services.tide.getStationById(id)
      );
    },
    sun: async (location: any, args: any, { services }: any) => {
      return services.sunMoon.getSunInfo(
        new Date(args.start),
        new Date(args.end),
        location.lat,
        location.long
      );
    },
    moon: async (location: any, args: any, { services }: any) => {
      return services.sunMoon.getMoonInfo(
        new Date(args.start),
        new Date(args.end),
        location.lat,
        location.long
      );
    },
    weatherForecast: async (location: any, args: any, { services }: any) => {
      return services.weather.getForecast(location);
    },
    hourlyWeatherForecast: async (
      location: any,
      args: any,
      { services }: any
    ) => {
      return services.weather.getHourlyForecast(location);
    }
  },
  TidePreditionStation: {
    url: (station: any) => {
      return `https://tidesandcurrents.noaa.gov/stationhome.html?id=${
        station.id
      }`;
    },
    tides: async (station: any, args: any, { services }: any) => {
      return await services.tide.getTidePredictions(
        args.start,
        args.end,
        station.id
      );
    }
  }
};

const context = {
  services: {
    tide: tideService,
    location: locationService,
    sunMoon: sunMoonService,
    weather: weatherService
  }
};
const server = new ApolloServer({ typeDefs, resolvers, context });

const app = new Koa();
server.applyMiddleware({ app, path: "/api" });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);

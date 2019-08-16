import Koa from "koa";
import serverless from "serverless-http";
import { ApolloServer } from "apollo-server-koa";
import * as tideService from "./services/tide";
import * as locationService from "./services/location";
import * as sunMoonService from "./services/sun-and-moon";
import * as weatherService from "./services/weather";
import * as marineService from "./services/marine";
import * as usgsService from "./services/usgs";
import * as radarService from "./services/radar";
import * as forecastService from "./services/forecast";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";

export interface Context {
  services: {
    tide: typeof tideService;
    location: typeof locationService;
    sunMoon: typeof sunMoonService;
    weather: typeof weatherService;
    marine: typeof marineService;
    usgs: typeof usgsService;
    radar: typeof radarService;
    forecast: typeof forecastService;
  };
}

const context: Context = {
  services: {
    tide: tideService,
    location: locationService,
    sunMoon: sunMoonService,
    weather: weatherService,
    marine: marineService,
    usgs: usgsService,
    radar: radarService,
    forecast: forecastService
  }
};
const server = new ApolloServer({
  typeDefs,
  resolvers: resolvers as any,
  context,
  playground: process.env.NODE_ENV !== "production",
  introspection: process.env.NODE_ENV !== "production"
});

const app = new Koa();
server.applyMiddleware({ app, path: "/api", cors: true });

export const graphql = serverless(app);

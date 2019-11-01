// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
import * as combinedForecastService from "./services/combined-forecast";
import * as nowcastService from "./services/nowcast";
import * as modisService from "./services/modis";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";

const IS_DEV =
  process.env.SERVERLESS_STAGE === "dev" || !!process.env.LOCAL_DEV;

export interface Context {
  services: {
    tide: typeof tideService;
    location: typeof locationService;
    sunMoon: typeof sunMoonService;
    weather: typeof weatherService;
    marine: typeof marineService;
    usgs: typeof usgsService;
    radar: typeof radarService;
    combinedForecast: typeof combinedForecastService;
    nowcast: typeof nowcastService;
    modis: typeof modisService;
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
    combinedForecast: combinedForecastService,
    nowcast: nowcastService,
    modis: modisService
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers: resolvers as any,
  context,
  formatError: error => {
    console.error({
      name: "Apollo Server Error",
      message: error.message,
      locations: error.locations,
      path: error.path,
      extensions: error.extensions
    });
    return error;
  },
  playground: IS_DEV,
  introspection: IS_DEV
});

const app = new Koa();
server.applyMiddleware({ app, path: "/api", cors: true });

if (process.env.LOCAL_DEV) {
  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

export const graphql = serverless(app);

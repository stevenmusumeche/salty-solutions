// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import Koa from "koa";
import serverless from "serverless-http";
import { ApolloServer, makeExecutableSchema } from "apollo-server-koa";
import * as noaaService from "./services/noaa/client";
import * as locationService from "./services/location";
import * as sunMoonService from "./services/sun-and-moon";
import * as weatherService from "./services/weather/client";
import * as marineService from "./services/marine/client";
import * as usgsService from "./services/usgs/client";
import * as combinedForecastService from "./services/combined-forecast";
import * as nowcastService from "./services/nowcast";
import * as modisService from "./services/modis";
import * as saveOurLakeService from "./services/saveourlake";
import * as userService from "./services/user";
import * as purchaseService from "./services/purchase";
import * as featureFlagService from "./services/feature-flag";
import * as emailService from "./services/email";
import latestUsgsLoader from "./loaders/latest-usgs";
import latestNoaaLoader from "./loaders/latest-noaa";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import Rollbar from "rollbar";
import traceResolvers from "@lifeomic/graphql-resolvers-xray-tracing";
import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";
import { UserToken } from "./services/user";

var rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_KEY,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

const IS_DEV =
  process.env.SERVERLESS_STAGE === "dev" || !!process.env.LOCAL_DEV;

export interface Context {
  koaCtx: Koa.Context & { state: { userToken?: UserToken } };
  services: {
    noaa: typeof noaaService;
    location: typeof locationService;
    sunMoon: typeof sunMoonService;
    weather: typeof weatherService;
    marine: typeof marineService;
    usgs: typeof usgsService;
    combinedForecast: typeof combinedForecastService;
    nowcast: typeof nowcastService;
    modis: typeof modisService;
    saveOurLake: typeof saveOurLakeService;
    user: typeof userService;
    purchase: typeof purchaseService;
    featureFlags: typeof featureFlagService;
    email: typeof emailService;
  };
  loaders: {
    latestUsgs: typeof latestUsgsLoader;
    latestNoaa: typeof latestNoaaLoader;
  };
  pass: any;
}

const formatError = (error: any, context: Context) => {
  rollbar.error(error, context.koaCtx.request, {
    path: error.path,
    locations: error.locations,
    ...error.extensions,
  });
  console.error({
    name: "Apollo Server Error",
    message: error.message,
    locations: error.locations,
    path: error.path,
    extensions: error.extensions,
  });
  return error;
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: resolvers as any,
});

if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
  traceResolvers(schema);
}

const server = new ApolloServer({
  schema,
  context: ({ ctx: koaCtx }): Context => {
    return {
      koaCtx,
      services: {
        noaa: noaaService,
        location: locationService,
        sunMoon: sunMoonService,
        weather: weatherService,
        marine: marineService,
        usgs: usgsService,
        combinedForecast: combinedForecastService,
        nowcast: nowcastService,
        modis: modisService,
        saveOurLake: saveOurLakeService,
        user: userService,
        purchase: purchaseService,
        featureFlags: featureFlagService,
        email: emailService,
      },
      loaders: {
        latestUsgs: latestUsgsLoader,
        latestNoaa: latestNoaaLoader,
      },
      pass: {},
    };
  },
  playground: IS_DEV,
  introspection: IS_DEV,
});

const app = new Koa();
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    rollbar.error(err as any, ctx.request);
  }
});

const jwks = jwksClient({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: "https://dev-nzoppbnb.us.auth0.com/.well-known/jwks.json",
});

// verify the JWT and put the user in Koa context
app.use(async (ctx, next) => {
  try {
    const token = (ctx.header.authorization || "").split(" ")[1];
    if (!token) {
      await next();
      return;
    }

    const signingKey = (await jwks.getSigningKeys())[0];
    const decodedToken = jwt.verify(token, signingKey.getPublicKey(), {
      ignoreExpiration: true,
    });
    ctx.state.userToken = decodedToken;
  } catch (e) {
    rollbar.warning("Error decoding token", e as any);
    console.error(e);
  }
  await next();
});

server.applyMiddleware({ app, path: "/api", cors: true });

if (process.env.LOCAL_DEV) {
  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

export const graphql = serverless(app);

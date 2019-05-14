import Koa from "koa";
import { ApolloServer, gql } from "apollo-server-koa";
import * as tideService from "./services/tide";
import * as locationService from "./services/location";

const typeDefs = gql`
  type Query {
    locations: [Location!]!
  }

  type Location {
    id: ID!
    name: String!
    tidePreditionStations: [TidePreditionStation!]!
    lat: Float!
    long: Float!
    marineZoneId: String!
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
`;

const resolvers = {
  Query: {
    locations: (_: any, __: any, { services }: any) => {
      return services.location.getAll();
    }
  },
  Location: {
    tidePreditionStations: (location: any, __: any, { services }: any) => {
      return location.tideStationIds.map((id: string) =>
        services.tide.getStationById(id)
      );
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
  services: { tide: tideService, location: locationService }
};
const server = new ApolloServer({ typeDefs, resolvers, context });

const app = new Koa();
server.applyMiddleware({ app, path: "/api" });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);

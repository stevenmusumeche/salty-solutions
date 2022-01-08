import { NoaaParam, Resolvers, UsgsParam, User } from "../generated/graphql";
import { ApolloError } from "apollo-server-koa";
import { notUndefined } from "../services/utils";
import { NoaaProduct, NoaaStationType } from "../services/noaa/source";
import { UsgsParams } from "../services/usgs/source";

const resolvers: Resolvers & { UsgsParam: Object; NoaaParam: Object } = {
  UsgsParam: {
    WaterTemp: "00010",
    WindSpeed: "00035",
    WindDirection: "00036",
    GuageHeight: "00065",
    Salinity: "00480",
  },
  NoaaParam: {
    Wind: "wind",
    WaterLevel: "water_level",
    AirTemperature: "air_temperature",
    WaterTemperature: "water_temperature",
    AirPressure: "air_pressure",
    TidePrediction: "predictions",
  },
  Query: {
    locations: (_, __, { services }) => {
      return services.location.getAll();
    },
    location: (_, args, { services }) => {
      const location = services.location.getById(args.id);
      if (!location) throw new ApolloError(`Unknown location ID ${args.id}`);
      return location;
    },
    tidePreditionStation: (_, { stationId }, { services }) => {
      if (!stationId) return null;
      const station = services.noaa.getStationById(stationId);
      if (!station)
        throw new ApolloError(`Unknown tide station ID ${stationId}`);
      return station;
    },
    tidePreditionStations: (root, args, { services }) => {
      return services.noaa.getStations();
    },
    usgsSite: (_, { siteId }, { services }) => {
      if (!siteId) return null;
      const site = services.usgs.getSiteById(siteId);
      if (!site) throw new ApolloError(`Unknown USGS site ID ${siteId}`);
      return site;
    },
    usgsSites: (_, args, { services }) => {
      return services.usgs.getSites();
    },
    appVersion: () => {
      return {
        ios: {
          minimumSupported: "1.0.24",
          current: "1.0.25",
        },
        android: {
          minimumSupported: "1.0.24",
          current: "1.0.25",
        },
      };
    },
    viewer: async (_, __, { services, koaCtx }) => {
      if (!koaCtx.state.userToken) throw new Error("Auth error");
      return services.user.getUser(koaCtx.state.userToken.sub);
    },
    featureFlags: async (_, { platform }, { services }) => {
      return {
        flags: await services.featureFlags.getAllFlags(platform),
      };
    },
  },
  Mutation: {
    userLoggedIn: async (_, { input }, { services, koaCtx }) => {
      if (!koaCtx.state.userToken) throw new Error("Auth error");
      const success = await services.user.loggedIn(
        input,
        koaCtx.state.userToken
      );
      return { success };
    },
    createUser: async (_, args, { services, koaCtx }) => {
      if (!koaCtx.state.userToken) throw new Error("Auth error");

      const email = args.input ? args.input.email : null;
      const user = await services.user.create(koaCtx.state.userToken, email);
      return { user: user as User };
    },
    upsertUser: async (_, args, { services, koaCtx }) => {
      if (!koaCtx.state.userToken) throw new Error("Auth error");
      const { input } = args;
      const user = await services.user.upsert(koaCtx.state.userToken, input);
      return { user: user as User };
    },
    completePurchase: async (_, args, { services, koaCtx }) => {
      if (!koaCtx.state.userToken) throw new Error("Auth error");

      const { platform, receipt, priceCents } = args.input;
      const isComplete = await services.purchase.completePurchase(
        koaCtx.state.userToken,
        platform,
        receipt,
        priceCents
      );

      return { isComplete };
    },
  },
  Location: {
    temperature: async (location) => {
      return { location };
    },
    tidePreditionStations: (location, { limit }, { services }) => {
      return [...location.tideStationIds, ...(location.noaaBuoyIds || [])]
        .slice(0, limit || 99)
        .map((id) => services.noaa.getStationById(id))
        .filter(notUndefined);
    },
    usgsSites: (location, _, { services }) => {
      return location.usgsSiteIds
        .map((id) => services.usgs.getSiteById(id))
        .filter(notUndefined);
    },
    sun: async (location, args, { services }) => {
      return services.sunMoon.getSunInfo(
        new Date(args.start),
        new Date(args.end),
        location.coords.lat,
        location.coords.lon
      );
    },
    moon: async (location, args, { services }) => {
      return services.sunMoon.getMoonInfo(
        new Date(args.start),
        new Date(args.end),
        location.coords.lat,
        location.coords.lon
      );
    },
    solunar: async (location, args, { services }) => {
      return services.sunMoon.getSolunarInfo(
        new Date(args.start),
        new Date(args.end),
        location.coords.lat,
        location.coords.lon
      );
    },
    combinedForecastV2: async (location, args, { services }) => {
      return services.combinedForecast.getCombinedForecastV2(
        location,
        new Date(args.start),
        new Date(args.end)
      );
    },
    weatherForecast: async (location, args, { services }) => {
      return services.weather.getForecast(location.id);
    },
    hourlyWeatherForecast: async (location, args, { services }) => {
      return services.weather.getHourlyForecast(location.id);
    },
    marineForecast: async (location, args, { services }) => {
      return services.marine.getForecast(location);
    },
    wind: async (location) => {
      return { location };
    },
    dataSources: async (location, args, { services }) => {
      return services.location.getDataSources(location);
    },
    modisMaps: async (location, { numDays }, { services }) => {
      return services.modis.getMaps(location, numDays || 1);
    },
    salinityMap: async (location, args, { services }) => {
      if (location.nowcastSubdomain) {
        return services.nowcast.getSalinityMap(location);
      } else if (location.saveOurLake) {
        return services.saveOurLake.getSalinityMap(location);
      }

      return "";
    },
  },
  TidePreditionStation: {
    url: (station) => {
      if (station.type === NoaaStationType.Buoy) {
        return `https://www.ndbc.noaa.gov/station_page.php?station=${station.id}`;
      }

      return `https://tidesandcurrents.noaa.gov/stationhome.html?id=${station.id}`;
    },
    tides: async (station, args, { services }) => {
      return await services.noaa.getTidePredictions(
        station.id,
        new Date(args.start),
        new Date(args.end)
      );
    },
    wind: async (station, args, ctx) => {
      return { station };
    },
    temperature: async (station, args, ctx) => {
      return { station };
    },
    waterTemperature: async (station, args, ctx) => {
      return { station };
    },
    waterHeight: async (station, args, { services }) => {
      return services.noaa.getWaterHeight(
        station.id,
        new Date(args.start),
        new Date(args.end)
      );
    },
    locations: async (station, args, { services }) => {
      return services.location
        .getAll()
        .filter((location) => location.tideStationIds.includes(station.id));
    },
    availableParamsV2: async (station) => {
      return station.availableParams.map((param) => {
        return {
          id: param as unknown as NoaaParam,
          station,
        };
      });
    },
  },
  UsgsSite: {
    url: (station) => {
      return `https://waterdata.usgs.gov/monitoring-location/${station.id}/`;
    },
    waterHeight: async (site, args, { services }) => {
      return services.usgs.getWaterHeight(
        site.id,
        new Date(args.start),
        new Date(args.end)
      );
    },
    salinity: async (site, args, ctx) => {
      return { site };
    },
    waterTemperature: async (site, args, ctx) => {
      return { site };
    },
    wind: async (site, args, ctx) => {
      return { site };
    },
    locations: async (site, args, { services }) => {
      return services.location
        .getAll()
        .filter((location) => location.usgsSiteIds.includes(site.id));
    },
    availableParamsV2: async (site) => {
      return site.availableParams.map((param) => {
        return {
          id: param as unknown as UsgsParam,
          site,
        };
      });
    },
  },
  UsgsParamInfo: {
    latestDataDate: async (parent, args, { loaders }) => {
      if (!parent.id || !parent.site) return null;

      return loaders.latestUsgs.load({
        siteId: parent.site.id,
        param: parent.id as unknown as UsgsParams,
      });
    },
  },
  NoaaParamInfo: {
    latestDataDate: async (parent, args, { loaders }) => {
      if (!parent.id || !parent.station) return null;

      return loaders.latestNoaa.load({
        siteId: parent.station.id,
        param: parent.id as unknown as NoaaProduct,
      });
    },
  },
  Salinity: {
    detail: async (parent, args, { services }) => {
      return services.usgs.getSalinity(
        parent.site.id,
        new Date(args.start),
        new Date(args.end)
      );
    },
    summary: async (parent, args, { services }) => {
      return {
        mostRecent: await services.usgs.getSalinityLatest(parent.site.id),
      };
    },
  },
  WaterTemperature: {
    detail: async (parent, args, { services }) => {
      // usgs
      if (parent.site) {
        return services.usgs.getWaterTemperature(
          parent.site.id,
          new Date(args.start),
          new Date(args.end)
        );
      }

      // noaa
      if (parent.station) {
        return services.noaa.getWaterTemperature(
          parent.station.id,
          new Date(args.start),
          new Date(args.end)
        );
      }

      throw new Error("No parent");
    },
    summary: async (parent, args, { services }) => {
      // usgs
      if (parent.site) {
        return {
          mostRecent: await services.usgs.getWaterTemperatureLatest(
            parent.site.id
          ),
        };
      }

      // noaa
      if (parent.station) {
        return {
          mostRecent: await services.noaa.getWaterTemperatureLatest(
            parent.station.id
          ),
        };
      }

      throw new Error("No parent");
    },
  },
  Wind: {
    detail: async (parent, args, { services }) => {
      // weather
      if (parent.location) {
        return services.weather.getWind(
          parent.location.id,
          new Date(args.start),
          new Date(args.end)
        );
      }

      // usgs
      if (parent.site) {
        return services.usgs.getWind(
          parent.site.id,
          new Date(args.start),
          new Date(args.end)
        );
      }

      // noaa
      if (parent.station) {
        return services.noaa.getWind(
          parent.station.id,
          new Date(args.start),
          new Date(args.end)
        );
      }

      throw new Error("No parent");
    },
    summary: async (parent, args, { services }) => {
      // weather
      if (parent.location) {
        const data = await services.weather.getWindLatest(parent.location.id);

        return {
          mostRecent: data,
        };
      }

      // usgs
      if (parent.site) {
        return {
          mostRecent: await services.usgs.getWindLatest(parent.site.id),
        };
      }

      // noaa
      if (parent.station) {
        return {
          mostRecent: await services.noaa.getWindLatest(parent.station.id),
        };
      }

      throw new Error("No parent");
    },
  },

  TemperatureResult: {
    detail: async (temperature, args, { services }) => {
      // weather
      if (temperature.location) {
        return services.weather.getTemperature(
          temperature.location.id,
          new Date(args.start),
          new Date(args.end)
        );
      }

      // noaa
      if (temperature.station) {
        return services.noaa.getTemperature(
          temperature.station.id,
          new Date(args.start),
          new Date(args.end)
        );
      }

      throw new Error("no parent for temperature");
    },
    summary: async (temperature, __, { services }) => {
      // weather
      if (temperature.location) {
        const data = await services.weather.getTemperatureLatest(
          temperature.location.id
        );

        if (!data) {
          return { mostRecent: null };
        }

        return {
          mostRecent: {
            timestamp: data.timestamp,
            temperature: data.temperature,
          },
        };
      }

      // noaa
      if (temperature.station) {
        return {
          mostRecent: await services.noaa.getTemperatureLatest(
            temperature.station.id
          ),
        };
      }

      throw new Error("No parent");
    },
  },
  User: {
    /**
     * @deprecated
     */
    purchases: async () => {
      return [];
    },
    entitledToPremium: async (parentUser, args, { services }) => {
      if (!parentUser.id) return false;
      return services.user.isEntitledToPremium(parentUser.id);
    },
  },
  CompletePurchaseResponse: {
    user: async (parent, args, { services, koaCtx }) => {
      if (!koaCtx.state.userToken) throw new Error("Auth error");
      return services.user.getUser(koaCtx.state.userToken.sub);
    },
  },
};

export default resolvers;

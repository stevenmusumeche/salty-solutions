import { Resolvers } from "../generated/graphql";
import { ApolloError } from "apollo-server-koa";
import { notUndefined } from "../services/utils";

const resolvers: Resolvers & { UsgsParam: Object } = {
  UsgsParam: {
    WaterTemp: "00010",
    WindSpeed: "00035",
    WindDirection: "00036",
    GuageHeight: "00065",
    Salinity: "00480",
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
      const station = services.tide.getStationById(stationId);
      if (!station)
        throw new ApolloError(`Unknown tide station ID ${stationId}`);
      return station;
    },
    usgsSite: (_, { siteId }, { services }) => {
      if (!siteId) return null;
      const site = services.usgs.getSiteById(siteId);
      if (!site) throw new ApolloError(`Unknown USGS site ID ${siteId}`);
      return site;
    },
  },
  Location: {
    temperature: async (location) => {
      return { location };
    },
    tidePreditionStations: (location, { limit }, { services }) => {
      return location.tideStationIds
        .slice(0, limit || 99)
        .map((id) => services.tide.getStationById(id))
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
    combinedForecastV2: async (location, args, { services }) => {
      return services.combinedForecast.getCombinedForecastV2(
        location,
        new Date(args.start),
        new Date(args.end)
      );
    },
    weatherForecast: async (location, args, { services }) => {
      return services.weather.getForecast(location);
    },
    hourlyWeatherForecast: async (location, args, { services }) => {
      return services.weather.getHourlyForecast(location);
    },
    marineForecast: async (location, args, { services }) => {
      return services.marine.getForecast(location);
    },
    wind: async (location) => {
      return { location };
    },
    maps: async (location, args, { services }) => {
      return {
        location,

        overlays: services.radar.getOverlays(location),
      };
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
      return `https://tidesandcurrents.noaa.gov/stationhome.html?id=${station.id}`;
    },
    tides: async (station, args, { services }) => {
      return await services.tide.getTidePredictions(
        new Date(args.start),
        new Date(args.end),
        station.id
      );
    },
  },
  UsgsSite: {
    waterHeight: async (site, args, { services }) => {
      return services.usgs.getWaterHeight(
        site.id,
        new Date(args.start),
        new Date(args.end)
      );
    },
    salinity: async (site, args, ctx) => {
      ctx.pass.site = site;
      return {};
    },
    waterTemperature: async (site, args, ctx) => {
      ctx.pass.site = site;
      return {};
    },
    wind: async (site, args, ctx) => {
      ctx.pass.site = site;
      return {};
    },
  },
  Salinity: {
    detail: async (_, args, { services, pass }) => {
      return services.usgs.getSalinity(
        pass.site.id,
        new Date(args.start),
        new Date(args.end)
      );
    },
    summary: async (_, args, { services, pass }) => {
      return {
        mostRecent: await services.usgs.getSalinityLatest(pass.site.id),
      };
    },
  },
  WaterTemperature: {
    detail: async (_, args, { services, pass }) => {
      return services.usgs.getWaterTemperature(
        pass.site.id,
        new Date(args.start),
        new Date(args.end)
      );
    },
    summary: async (_, args, { services, pass }) => {
      return {
        mostRecent: await services.usgs.getWaterTemperatureLatest(pass.site.id),
      };
    },
  },
  UsgsWind: {
    detail: async (_, args, { services, pass }) => {
      return services.usgs.getWind(
        pass.site.id,
        new Date(args.start),
        new Date(args.end)
      );
    },
    summary: async (_, args, { services, pass }) => {
      return {
        mostRecent: await services.usgs.getWindLatest(pass.site.id),
      };
    },
  },
  Wind: {
    detail: async (wind, args, { loaders }) => {
      const result = await loaders.conditionsLoader.load({
        location: wind.location,
        start: new Date(args.start),
        end: new Date(args.end),
      });
      return result.wind;
    },
    summary: async (wind, args, { loaders }) => {
      const result = await loaders.latestConditionsLoader.load(wind.location);
      return {
        mostRecent: result.wind,
      };
    },
  },
  TemperatureResult: {
    detail: async (temperature, args, { loaders }) => {
      const data = await loaders.conditionsLoader.load({
        location: temperature.location,
        start: new Date(args.start),
        end: new Date(args.end),
      });
      return data.temperature;
    },
    summary: async (temperature, __, { loaders }) => {
      const data = await loaders.latestConditionsLoader.load(
        temperature.location
      );

      return {
        mostRecent: {
          timestamp: data.temperature.timestamp,
          temperature: data.temperature.temperature,
        },
      };
    },
  },
  Maps: {
    radar: (maps, args, { services }) => {
      return services.radar.getRadarImages(maps.location, args.numImages);
    },
  },
};

export default resolvers;

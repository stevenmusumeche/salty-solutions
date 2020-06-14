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
    // combinedForecast: async (location, args, { services }) => {
    //   return services.combinedForecast.getCombinedForecast(location);
    // },
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
    salinity: async (site, args, { services }) => {
      const detail = await services.usgs.getSalinity(
        site.id,
        new Date(args.start),
        new Date(args.end)
      );
      const mostRecent = detail[detail.length - 1];
      return {
        summary: { mostRecent },
        detail,
      };
    },
    waterTemperature: async (site, args, ctx) => {
      ctx.pass.site = site;
      return {};
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
  Wind: {
    detail: async (wind, args, { services }) => {
      const result = await services.weather.getConditions(
        wind.location,
        new Date(args.start),
        new Date(args.end)
      );
      return result.wind;
    },
    summary: async (wind, args, { services }) => {
      // todo: switch to "getCurrentConditions"
      const result = await services.weather.getLatestConditions(wind.location);
      return {
        mostRecent: result.wind,
      };
    },
  },
  TemperatureResult: {
    detail: async (temperature, args, { services }) => {
      const data = await services.weather.getConditions(
        temperature.location,
        new Date(args.start),
        new Date(args.end)
      );
      return data.temperature;
    },
    summary: async (temperature, __, { services }) => {
      const data = await services.weather.getCurrentConditions(
        temperature.location
      );

      return {
        mostRecent: data,
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

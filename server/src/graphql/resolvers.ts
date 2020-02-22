import { Resolvers } from "../generated/graphql";
import { ApolloError, UserInputError } from "apollo-server-koa";
import { notUndefined } from "../services/utils";

const DEFAULT_NUM_HOURS = 24;

const resolvers: Resolvers = {
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
      const allSites = services.location
        .getAll()
        .flatMap(location => location.usgsSites);
      const site = allSites.find(site => site.id === siteId);
      if (!site) throw new ApolloError(`Unknown USGS site ID ${siteId}`);
      return site;
    }
  },
  Location: {
    temperature: async location => {
      return { location };
    },
    tidePreditionStations: (location, __, { services }) => {
      return location.tideStationIds
        .map(id => services.tide.getStationById(id))
        .filter(notUndefined);
    },
    usgsSites: (location, _, context) => {
      context.pass = { location };
      return location.usgsSites;
    },
    sun: async (location, args, { services }) => {
      return services.sunMoon.getSunInfo(
        new Date(args.start),
        new Date(args.end),
        location.lat,
        location.long
      );
    },
    moon: async (location, args, { services }) => {
      return services.sunMoon.getMoonInfo(
        new Date(args.start),
        new Date(args.end),
        location.lat,
        location.long
      );
    },
    combinedForecast: async (location, args, { services }) => {
      return services.combinedForecast.getCombinedForecast(location);
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
    waterTemperature: async location => {
      return { location };
    },
    wind: async location => {
      return { location };
    },
    salinity: async (location, args, { services }) => {
      return { location, numHours: args.numHours };
    },
    maps: async (location, args, { services }) => {
      return {
        location,

        overlays: services.radar.getOverlays(location)
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
    }
  },
  TidePreditionStation: {
    url: station => {
      return `https://tidesandcurrents.noaa.gov/stationhome.html?id=${station.id}`;
    },
    tides: async (station, args, { services }) => {
      return await services.tide.getTidePredictions(
        new Date(args.start),
        new Date(args.end),
        station.id
      );
    }
  },
  UsgsSite: {
    waterHeight: async (site, args, { services }) => {
      return services.usgs.getWaterHeight(
        site.id,
        new Date(args.start),
        new Date(args.end)
      );
    }
  },
  Wind: {
    detail: async (wind, args, { services }) => {
      const result = await services.weather.getConditions(
        wind.location,
        args.numHours || DEFAULT_NUM_HOURS
      );
      return result.wind;
    },
    summary: async (wind, args, { services }) => {
      const result = await services.weather.getLatestConditions(wind.location);
      return {
        mostRecent: result.wind
      };
    }
  },
  WaterTemperature: {
    detail: async (waterTemperature, args, { services }) => {
      return services.usgs.getWaterTemperature(
        waterTemperature.location,
        args.numHours || DEFAULT_NUM_HOURS
      );
    },
    summary: async (waterTemperature, args, { services }) => {
      return {
        mostRecent: await services.usgs.getWaterTemperatureLatest(
          waterTemperature.location
        )
      };
    }
  },
  TemperatureResult: {
    summary: async (temperature, __, { services }) => {
      const data = await services.weather.getCurrentConditions(
        temperature.location
      );

      return {
        mostRecent: data
      };
    },
    detail: async (temperature, args, { services }) => {
      const data = await services.weather.getConditions(
        temperature.location,
        args.numHours || DEFAULT_NUM_HOURS
      );
      return data.temperature;
    }
  },
  Salinity: {
    summary: async (salinity, args, { services }) => {
      return {
        mostRecent: await services.usgs.getSalinityLatest(salinity.location)
      };
    },
    detail: async (salinity, args, { services }) => {
      return services.usgs.getSalinity(
        salinity.location,
        salinity.numHours || DEFAULT_NUM_HOURS
      );
    }
  },
  Maps: {
    radar: (maps, args, { services }) => {
      return services.radar.getRadarImages(maps.location, args.numImages);
    }
  }
};

export default resolvers;

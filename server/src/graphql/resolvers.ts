import { Resolvers } from "../generated/graphql";
import { ApolloError } from "apollo-server-koa";
import { notUndefined } from "../services/utils";
import { NoaaStationType } from "../services/noaa/source";

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
    detail: async (parent, args, { services, loaders }) => {
      // weather
      if (parent.location) {
        const result = await loaders.conditionsLoader.load({
          location: parent.location,
          start: new Date(args.start),
          end: new Date(args.end),
        });
        return result.wind;
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
    summary: async (parent, args, { services, loaders }) => {
      // weather
      if (parent.location) {
        const result = await loaders.latestConditionsLoader.load(
          parent.location
        );
        return {
          mostRecent: result.wind,
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
    detail: async (temperature, args, { loaders, services }) => {
      // weather
      if (temperature.location) {
        const data = await loaders.conditionsLoader.load({
          location: temperature.location,
          start: new Date(args.start),
          end: new Date(args.end),
        });
        return data.temperature;
      }

      // noaa
      if (temperature.station) {
        return services.noaa.getTemperature(
          temperature.station.id,
          new Date(args.start),
          new Date(args.end)
        );
      }
    },
    summary: async (temperature, __, { loaders, services }) => {
      // weather
      if (temperature.location) {
        const data = await loaders.latestConditionsLoader.load(
          temperature.location
        );

        if (!data.temperature) {
          return { mostRecent: null };
        }

        return {
          mostRecent: {
            timestamp: data.temperature.timestamp,
            temperature: data.temperature.temperature,
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
  Maps: {
    radar: (maps, args, { services }) => {
      return services.radar.getRadarImages(maps.location, args.numImages);
    },
  },
};

export default resolvers;

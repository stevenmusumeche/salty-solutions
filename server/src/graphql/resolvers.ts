import { Resolvers } from "../generated/graphql";
import { ApolloError } from "apollo-server-koa";

const DEFAULT_NUM_DAYS = 3;
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
    }
  },
  Location: {
    temperature: async (location, __, { services }) => {
      const data = await services.weather.getCurrentConditions(location);

      return {
        summary: {
          mostRecent: +data.temperature.toFixed(1)
        }
      };
    },
    tidePreditionStations: (location, __, { services }) => {
      return location.tideStationIds
        .map(id => services.tide.getStationById(id))
        .filter(notUndefined);
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
    weatherForecast: async (location, args, { services }) => {
      return services.weather.getForecast(location);
    },
    hourlyWeatherForecast: async (location, args, { services }) => {
      return services.weather.getHourlyForecast(location);
    },
    marineForecast: async (location, args, { services }) => {
      return services.marine.getForecast(location);
    },
    waterHeight: async (location, args, { services }) => {
      return services.usgs.getWaterHeight(
        location,
        args.numDays || DEFAULT_NUM_DAYS
      );
    },
    waterTemperature: async (location, args, { services }) => {
      return { location };
    },
    wind: async (location, args, { services }) => {
      return { location };
    },
    salinity: async (location, args, { services }) => {
      const detail = await services.usgs.getSalinity(
        location,
        args.numDays || DEFAULT_NUM_DAYS
      );

      const sum = detail.reduce((acc: number, cur) => {
        return (acc += cur.salinity);
      }, 0);
      const averageValue = +(sum / detail.length).toFixed(1);

      return {
        detail,
        summary: {
          averageValue,
          startTimestamp: detail[0].timestamp,
          endTimestamp: detail[detail.length - 1].timestamp
        }
      };
    }
  },
  TidePreditionStation: {
    url: station => {
      return `https://tidesandcurrents.noaa.gov/stationhome.html?id=${
        station.id
      }`;
    },
    tides: async (station, args, { services }) => {
      return await services.tide.getTidePredictions(
        new Date(args.start),
        new Date(args.end),
        station.id
      );
    }
  },
  Wind: {
    detail: async (wind, args, { services }) => {
      return services.usgs.getWind(
        wind.location,
        args.numHours || DEFAULT_NUM_HOURS
      );
    },
    summary: async (wind, args, { services }) => {
      return {
        mostRecent: await services.usgs.getWindLatest(wind.location)
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
  }
};

export default resolvers;

function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

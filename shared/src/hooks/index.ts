import { useMemo } from "react";
import {
  LocationDetailFragment,
  Maybe,
  UsgsParam,
  NoaaParam,
} from "../graphql";
export { useCurrentWindData } from "./useWindData";
export { useSalinityData } from "./useSalinityData";
export { useTemperatureData } from "./useTemperatureData";
export { useWaterTemperatureData } from "./useWaterTemperatureData";

export const useSalinitySites = (location?: Maybe<LocationDetailFragment>) => {
  return useMemo(() => {
    return (
      location?.usgsSites.filter((site) =>
        site.availableParams.includes(UsgsParam.Salinity)
      ) || []
    );
  }, [location]);
};

export const useWindSites = (location?: Maybe<LocationDetailFragment>) => {
  return useMemo(() => {
    const usgs =
      location?.usgsSites.filter((site) =>
        site.availableParams.includes(UsgsParam.WindSpeed)
      ) || [];

    const noaa =
      location?.tidePreditionStations.filter((station) =>
        station.availableParams.includes(NoaaParam.Wind)
      ) || [];

    return [...usgs, ...noaa];
  }, [location]);
};

export const useAirTempSites = (location?: Maybe<LocationDetailFragment>) => {
  return useMemo(() => {
    return (
      location?.tidePreditionStations.filter((station) =>
        station.availableParams.includes(NoaaParam.AirTemperature)
      ) || []
    );
  }, [location]);
};

export const useWaterHeightSites = (
  location?: Maybe<LocationDetailFragment>
) => {
  return useMemo(() => {
    const usgs =
      location?.usgsSites.filter((site) =>
        site.availableParams.includes(UsgsParam.GuageHeight)
      ) || [];

    const noaa =
      location?.tidePreditionStations.filter((station) =>
        station.availableParams.includes(NoaaParam.WaterLevel)
      ) || [];

    return [...usgs, ...noaa];
  }, [location]);
};

export const useWaterTempSites = (location?: Maybe<LocationDetailFragment>) => {
  return useMemo(() => {
    const usgs =
      location?.usgsSites.filter((site) =>
        site.availableParams.includes(UsgsParam.WaterTemp)
      ) || [];

    const noaa =
      location?.tidePreditionStations.filter((station) =>
        station.availableParams.includes(NoaaParam.WaterTemperature)
      ) || [];

    return [...usgs, ...noaa];
  }, [location]);
};

export const useTideStationSites = (
  location?: Maybe<LocationDetailFragment>
) => {
  return useMemo(() => {
    return (
      location?.tidePreditionStations.filter((station) =>
        station.availableParams.includes(NoaaParam.TidePrediction)
      ) || []
    );
  }, [location]);
};

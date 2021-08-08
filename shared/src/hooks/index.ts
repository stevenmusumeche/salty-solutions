import { differenceInDays, differenceInHours } from "date-fns";
import { zip } from "lodash";
import { useMemo } from "react";
import {
  LocationDetailFragment,
  Maybe,
  UsgsParam,
  NoaaParam,
  UsgsSiteDetailFragment,
  TideStationDetailFragment,
} from "../graphql";
export { useCurrentWindData } from "./useWindData";
export { useSalinityData } from "./useSalinityData";
export { useTemperatureData } from "./useTemperatureData";
export { useWaterTemperatureData } from "./useWaterTemperatureData";

const RECENT_HOURS_QUALIFIER = 48;

export const useSalinitySites = (location?: Maybe<LocationDetailFragment>) => {
  return useMemo(() => {
    return getUsgsSitesWithParam(UsgsParam.Salinity, location).sort(
      sortOldDataLast
    );
  }, [location]);
};

export const useWindSites = (location?: Maybe<LocationDetailFragment>) => {
  return useMemo(() => {
    const usgs = getUsgsSitesWithParam(UsgsParam.WindSpeed, location);
    const noaa = getNoaaStationsWithParam(NoaaParam.Wind, location);
    return [...usgs, ...noaa].sort(sortOldDataLast);
  }, [location]);
};

export const useAirTempSites = (location?: Maybe<LocationDetailFragment>) => {
  return useMemo(
    () =>
      getNoaaStationsWithParam(NoaaParam.AirTemperature, location).sort(
        sortOldDataLast
      ),
    [location]
  );
};

export const useWaterHeightSites = (
  location?: Maybe<LocationDetailFragment>
) => {
  return useMemo(() => {
    const usgs = getUsgsSitesWithParam(UsgsParam.GuageHeight, location);
    const noaa = getNoaaStationsWithParam(NoaaParam.WaterLevel, location);
    return [...usgs, ...noaa].sort(sortOldDataLast);
  }, [location]);
};

export const useWaterTempSites = (location?: Maybe<LocationDetailFragment>) => {
  return useMemo(() => {
    const usgs = getUsgsSitesWithParam(UsgsParam.WaterTemp, location);
    const noaa = getNoaaStationsWithParam(NoaaParam.WaterTemperature, location);
    return [...usgs, ...noaa].sort(sortOldDataLast);
  }, [location]);
};

export const useTideStationSites = (
  location?: Maybe<LocationDetailFragment>
) => {
  return useMemo(
    () =>
      getNoaaStationsWithParam(NoaaParam.TidePrediction, location).sort(
        sortOldDataLast
      ),
    [location]
  );
};

function sortOldDataLast(
  a: { hasRecentData: boolean },
  b: { hasRecentData: boolean }
) {
  if (a.hasRecentData && !b.hasRecentData) return -1;
  if (!a.hasRecentData && b.hasRecentData) return 1;
  return 0;
}

function getUsgsSitesWithParam(
  paramType: UsgsParam,
  location?: Maybe<LocationDetailFragment>
) {
  return (
    location?.usgsSites.filter((site) =>
      site.availableParamsV2.map((x) => x.id).includes(paramType)
    ) || []
  ).map((site) => addUsgsRecencyData(site, paramType));
}

function getNoaaStationsWithParam(
  paramType: NoaaParam,
  location?: Maybe<LocationDetailFragment>
) {
  return (
    location?.tidePreditionStations.filter((site) =>
      site.availableParamsV2.map((x) => x.id).includes(paramType)
    ) || []
  ).map((station) => addNoaaRecencyData(station, paramType));
}

function getUsgsParam(
  params: UsgsSiteDetailFragment["availableParamsV2"],
  paramType: UsgsParam
) {
  return params.filter((paramInfo) => paramInfo.id === paramType)[0];
}

function getNoaaParam(
  params: TideStationDetailFragment["availableParamsV2"],
  paramType: NoaaParam
) {
  return params.filter((paramInfo) => paramInfo.id === paramType)[0];
}

function addUsgsRecencyData(
  site: UsgsSiteDetailFragment,
  paramType: UsgsParam
) {
  const paramInfo = getUsgsParam(site.availableParamsV2, paramType);
  let hasRecentData = false;
  if (paramInfo && paramInfo.latestDataDate) {
    const latest = new Date(paramInfo.latestDataDate);
    hasRecentData =
      differenceInHours(new Date(), latest) < RECENT_HOURS_QUALIFIER;
  }
  return {
    ...site,
    name: site.name + (hasRecentData ? "" : " [no recent data]"),
    hasRecentData,
  };
}

function addNoaaRecencyData(
  station: TideStationDetailFragment,
  paramType: NoaaParam
) {
  const paramInfo = getNoaaParam(station.availableParamsV2, paramType);
  console.log(station.name, paramType, paramInfo?.latestDataDate);
  let hasRecentData = false;
  if (paramInfo && paramInfo.latestDataDate) {
    const latest = new Date(paramInfo.latestDataDate);
    hasRecentData =
      differenceInHours(new Date(), latest) < RECENT_HOURS_QUALIFIER;
  }
  return {
    ...station,
    name: station.name + (hasRecentData ? "" : " [no recent data]"),
    hasRecentData,
  };
}

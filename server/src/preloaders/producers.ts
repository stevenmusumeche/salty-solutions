import { ScheduledHandler } from "aws-lambda";
import { getAll } from "../services/location";
import { sendMessage, sendMessageBatch } from "../services/queue";
import { format, addDays, startOfDay, subDays } from "date-fns";
import { chunk } from "lodash";

export const PRODUCER_NAMES = {
  forecast: "forecast-preloader",
  tide: "tide-preloader",
  windFinder: "wind-finder-preloader",
  usgs: "usgs-preloader",
  noaa: "noaa-preloader",
};

export const forecast: ScheduledHandler = async () => {
  console.log("Preloading forecasts");

  for (const location of getAll()) {
    const body = { locationId: location.id };
    await sendMessage(process.env.QUEUE_URL!, PRODUCER_NAMES.forecast, body);
  }
};

export const tide: ScheduledHandler = async () => {
  console.log("Preloading tides");

  const curDate = new Date();
  const startDate = subDays(startOfDay(curDate), 1).toISOString();
  const endDate = addDays(startOfDay(curDate), 30).toISOString();

  const uniqueStationIds = getAll().reduce((stations, location) => {
    location.tideStationIds.forEach((id) => stations.add(id));
    return stations;
  }, new Set());

  const chunks = chunk([...uniqueStationIds], 10);
  for (const chunk of chunks) {
    await sendMessageBatch(
      process.env.QUEUE_URL!,
      PRODUCER_NAMES.tide,
      chunk.map((stationId) => ({
        stationId,
        startDate,
        endDate,
      }))
    );
  }
};

export const windFinder: ScheduledHandler = async () => {
  console.log("Preloading windfinder");

  const uniqueSlugs = new Set(
    getAll()
      .filter((location) => !!location.windfinder.slug)
      .map((location) => location.windfinder.slug)
  );

  for (const slug of uniqueSlugs) {
    const body = { slug };
    await sendMessage(process.env.QUEUE_URL!, PRODUCER_NAMES.windFinder, body);
  }
};

export const usgs: ScheduledHandler = async () => {
  console.log("Preloading USGS");

  const uniqueSiteIds = getAll().reduce((sites, location) => {
    location.usgsSiteIds.forEach((id) => sites.add(id));
    return sites;
  }, new Set());

  const chunks = chunk([...uniqueSiteIds], 10);
  for (const chunk of chunks) {
    await sendMessageBatch(
      process.env.QUEUE_URL!,
      PRODUCER_NAMES.usgs,
      chunk.map((siteId) => ({ siteId, numHours: 24 }))
    );
  }
};

export const noaa: ScheduledHandler = async () => {
  console.log("Preloading NOAA");

  const uniqueStationIds = getAll().reduce((stations, location) => {
    location.tideStationIds.forEach((id) => stations.add(id));
    return stations;
  }, new Set());

  const chunks = chunk([...uniqueStationIds], 10);
  for (const chunk of chunks) {
    await sendMessageBatch(
      process.env.QUEUE_URL!,
      PRODUCER_NAMES.noaa,
      chunk.map((stationId) => ({ stationId, numHours: 24 }))
    );
  }
};

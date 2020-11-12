import { ScheduledHandler } from "aws-lambda";
import { addDays, addHours, endOfDay, startOfDay, subHours } from "date-fns";
import { chunk } from "lodash";
import { getAll } from "../services/location";
import { sendMessage, sendMessageBatch } from "../services/queue";

export const PRODUCER_NAMES = {
  forecast: "forecast-preloader",
  tide: "tide-preloader",
  windFinder: "wind-finder-preloader",
  usgs: "usgs-preloader",
  noaa: "noaa-preloader",
  noaaBuoy: "noaa-buoy-preloader",
  weatherConditions: "weather-conditions-preloader",
  weatherForecast: "weather-forecast-preloader",
  weatherForecastHourly: "weather-forecast-hourly-preloader",
  marineForecast: "marine-forecast-preloader",
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
  const uniqueStationIds = getAll().reduce((stations, location) => {
    location.tideStationIds.forEach((id) => stations.add(id));
    return stations;
  }, new Set());

  let messages = [];
  // fetch tide data for the days in this range (currently a single day 28 days in the future)
  for (let offset = 28; offset <= 28; offset++) {
    messages.push(
      ...[...uniqueStationIds].map((stationId) => ({
        stationId,
        startDate: subHours(
          addDays(startOfDay(curDate), offset),
          2
        ).toISOString(),
        endDate: addHours(addDays(endOfDay(curDate), offset), 2).toISOString(),
      }))
    );
  }

  const chunks = chunk(messages, 10);
  for (const chunk of chunks) {
    await sendMessageBatch(process.env.QUEUE_URL!, PRODUCER_NAMES.tide, chunk);
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

export const noaaBuoy: ScheduledHandler = async () => {
  console.log("Preloading NOAA Buoy");

  const uniqueStationIds = getAll().reduce((stations, location) => {
    const locationBuoyIds = location.noaaBuoyIds || [];
    locationBuoyIds.forEach((id) => stations.add(id));
    return stations;
  }, new Set());

  const chunks = chunk([...uniqueStationIds], 10);
  for (const chunk of chunks) {
    await sendMessageBatch(
      process.env.QUEUE_URL!,
      PRODUCER_NAMES.noaaBuoy,
      chunk.map((stationId) => ({ stationId, numHours: 24 }))
    );
  }
};

export const weatherConditions: ScheduledHandler = async () => {
  console.log("Preloading Weather Conditions");

  const allLocationIds = getAll().map((location) => location.id);
  const chunks = chunk([...allLocationIds], 10);
  for (const chunk of chunks) {
    await sendMessageBatch(
      process.env.QUEUE_URL!,
      PRODUCER_NAMES.weatherConditions,
      chunk.map((locationId) => ({ locationId, numHours: 6 }))
    );
  }
};

export const weatherForecast: ScheduledHandler = async () => {
  console.log("Preloading Weather Forecast");

  const allLocationIds = getAll().map((location) => location.id);
  const chunks = chunk([...allLocationIds], 10);
  for (const chunk of chunks) {
    await sendMessageBatch(
      process.env.QUEUE_URL!,
      PRODUCER_NAMES.weatherForecast,
      chunk.map((locationId) => ({ locationId }))
    );
  }
};

export const weatherForecastHourly: ScheduledHandler = async () => {
  console.log("Preloading Hourly Weather Forecast");

  const allLocationIds = getAll().map((location) => location.id);
  const chunks = chunk([...allLocationIds], 10);
  for (const chunk of chunks) {
    await sendMessageBatch(
      process.env.QUEUE_URL!,
      PRODUCER_NAMES.weatherForecastHourly,
      chunk.map((locationId) => ({ locationId }))
    );
  }
};

export const marineForecast: ScheduledHandler = async () => {
  console.log("Preloading Marine Forecast");

  const uniqueMarineZoneIds = new Set(
    getAll().map((location) => location.marineZoneId)
  );

  const chunks = chunk([...uniqueMarineZoneIds], 10);
  for (const chunk of chunks) {
    await sendMessageBatch(
      process.env.QUEUE_URL!,
      PRODUCER_NAMES.marineForecast,
      chunk.map((marineZoneId) => ({ marineZoneId }))
    );
  }
};

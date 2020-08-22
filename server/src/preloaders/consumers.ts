import { SQSHandler } from "aws-lambda";
import { loadAndSave } from "../services/wind-finder";
import { storeUsgsData } from "../services/usgs/source";
import {
  storeNoaaData,
  storeTideData,
  storeBuoyData,
} from "../services/noaa/source";
import {
  storeWeatherConditions,
  storeWeatherForecast,
  storeHourlyWeatherForecast,
} from "../services/weather/source";

export const tide: SQSHandler = async (event, ctx, cb) => {
  for (const record of event.Records) {
    const payload = JSON.parse(record.body);
    console.log(
      "Preloading tides for",
      payload.stationId,
      payload.startDate,
      payload.endDate
    );

    await storeTideData(
      payload.stationId,
      new Date(payload.startDate),
      new Date(payload.endDate)
    );
    console.log("Finished preloading tides for", payload.stationId);
  }
};

export const windFinder: SQSHandler = async (event, ctx, cb) => {
  for (const record of event.Records) {
    const payload = JSON.parse(record.body);
    console.log("Preloading windfinder for", payload.slug);
    await loadAndSave(payload.slug);
    console.log("Finished preloading windfinder for", payload.slug);
  }
};

export const usgs: SQSHandler = async (event, ctx, cb) => {
  for (const record of event.Records) {
    const payload = JSON.parse(record.body);
    console.log("Preloading USGS for", payload.siteId);
    await storeUsgsData(payload.siteId, payload.numHours);
    console.log("Finished preloading USGS for", payload.siteId);
  }
};

export const noaa: SQSHandler = async (event, ctx, cb) => {
  for (const record of event.Records) {
    const payload = JSON.parse(record.body);
    console.log("Preloading NOAA for", payload.stationId);
    await storeNoaaData(payload.stationId, payload.numHours);
    console.log("Finished preloading NOAA for", payload.stationId);
  }
};

export const noaaBuoy: SQSHandler = async (event, ctx, cb) => {
  for (const record of event.Records) {
    const payload = JSON.parse(record.body);
    console.log("Preloading NOAA Buoy for", payload.stationId);
    await storeBuoyData(payload.stationId, payload.numHours);
    console.log("Finished preloading NOAA Buoy for", payload.stationId);
  }
};

export const weatherConditions: SQSHandler = async (event, ctx, cb) => {
  for (const record of event.Records) {
    const payload = JSON.parse(record.body);
    console.log("Preloading weather conditions for", payload.locationId);
    await storeWeatherConditions(payload.locationId, payload.numHours);
    console.log(
      "Finished preloading weather conditions for",
      payload.locationId
    );
  }
};

export const weatherForecast: SQSHandler = async (event, ctx, cb) => {
  for (const record of event.Records) {
    const payload = JSON.parse(record.body);
    console.log("Preloading weather forecast for", payload.locationId);
    await storeWeatherForecast(payload.locationId);
    console.log("Finished preloading weather forecast for", payload.locationId);
  }
};

export const weatherForecastHourly: SQSHandler = async (event, ctx, cb) => {
  for (const record of event.Records) {
    const payload = JSON.parse(record.body);
    console.log("Preloading hourly weather forecast for", payload.locationId);
    await storeHourlyWeatherForecast(payload.locationId);
    console.log(
      "Finished preloading hourly weather forecast for",
      payload.locationId
    );
  }
};

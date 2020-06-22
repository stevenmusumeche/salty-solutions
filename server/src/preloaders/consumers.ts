import { SQSHandler } from "aws-lambda";
import { loadAndSave } from "../services/wind-finder";
import { storeUsgsData } from "../services/usgs/source";
import { storeNoaaData, storeTideData } from "../services/noaa/source";

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

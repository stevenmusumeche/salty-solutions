import { SQSHandler } from "aws-lambda";
import { getById } from "../services/location";
import { getTidePredictions } from "../services/tide";
import { getCombinedForecast } from "../services/combined-forecast";
import { loadAndSave } from "../services/wind-finder";
import { storeUsgsData } from "../services/usgs/source";

export const forecast: SQSHandler = async (event, ctx, cb) => {
  for (const record of event.Records) {
    const payload = JSON.parse(record.body);
    console.log("Preloading forecast for", payload.locationId);
    const location = getById(payload.locationId);
    if (!location) throw new Error(`Unknown location ${payload.locationId}`);
    await getCombinedForecast(location);
  }
};

export const tide: SQSHandler = async (event, ctx, cb) => {
  for (const record of event.Records) {
    const payload = JSON.parse(record.body);
    console.log(
      "Preloading tides for",
      payload.stationId,
      payload.startDate,
      payload.endDate
    );

    await getTidePredictions(
      new Date(payload.startDate),
      new Date(payload.endDate),
      payload.stationId
    );
  }
};

export const windFinder: SQSHandler = async (event, ctx, cb) => {
  for (const record of event.Records) {
    const payload = JSON.parse(record.body);
    console.log("Preloading windfinder for", payload.slug);
    await loadAndSave(payload.slug);
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

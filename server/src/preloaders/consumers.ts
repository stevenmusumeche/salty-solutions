import { SQSHandler } from "aws-lambda";
import { getById } from "../services/location";
import { getTidePredictions } from "../services/tide";
import { getCombinedForecast } from "../services/combined-forecast";
import { loadAndSave } from "../services/wind-finder";

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

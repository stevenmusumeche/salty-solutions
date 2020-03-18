import { SQSHandler } from "aws-lambda";
import { getForecast as getMarineForecast } from "../services/marine";
import { getForecast } from "../services/weather";
import { getById } from "../services/location";
import { getTidePredictions } from "../services/tide";

export const forecast: SQSHandler = async (event, ctx, cb) => {
  for (const record of event.Records) {
    const payload = JSON.parse(record.body);
    console.log("Preloading forecast for", payload.locationId);
    const location = getById(payload.locationId);
    if (!location) throw new Error(`Unknown location ${payload.locationId}`);
    await Promise.all([getMarineForecast(location), getForecast(location)]);
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

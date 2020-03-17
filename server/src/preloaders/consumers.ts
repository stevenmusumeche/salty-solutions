import { SQSHandler } from "aws-lambda";
import { getForecast as getMarineForecast } from "../services/marine";
import { getForecast } from "../services/weather";
import { getById } from "../services/location";

export const forecast: SQSHandler = async (event, ctx, cb) => {
  for (const record of event.Records) {
    const payload = JSON.parse(record.body);
    console.log("Processing forecast for ", payload.locationId);
    const location = getById(payload.locationId);
    if (!location) throw new Error(`Unknown location ${payload.locationId}`);
    await Promise.all([getMarineForecast(location), getForecast(location)]);
    console.log("Finished processing forecast for ", payload.locationId);
  }
};

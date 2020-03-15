import { ScheduledHandler, SQSHandler } from "aws-lambda";
import { getAll } from "./services/location";
import { getForecast as getMarineForecast } from "./services/marine";
import { getForecast } from "./services/weather";

export const forecast: ScheduledHandler = async (event, ctx, cb) => {
  for (const location of getAll()) {
    console.log("Preloading forecasts for " + location.name);
    await Promise.all([getForecast(location), getMarineForecast(location)]);
  }

  return;
};

export const foo: SQSHandler = async (event, ctx, cb) => {
  console.log(
    "received SQS event",
    event.Records.map(x => x.body)
  );
};

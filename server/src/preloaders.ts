import { ScheduledHandler } from "aws-lambda";
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

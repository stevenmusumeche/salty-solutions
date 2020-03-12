import { ScheduledHandler } from "aws-lambda";
import { getAll } from "./services/location";
import { getForecast } from "./services/marine";

export const forecast: ScheduledHandler = async (event, ctx, cb) => {
  for (const location of getAll()) {
    console.log("Preloading forecast for " + location.name);
    await getForecast(location);
  }

  cb(null);
};

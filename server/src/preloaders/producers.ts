import { ScheduledHandler } from "aws-lambda";
import { getAll } from "../services/location";

export const forecast: ScheduledHandler = async (event, ctx, cb) => {
  for (const location of getAll()) {
    console.log(
      "creating queue message for forecasts for " + location.name,
      process.env.QUEUE_URL
    );
  }
};

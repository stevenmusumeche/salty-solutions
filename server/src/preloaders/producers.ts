import { ScheduledHandler } from "aws-lambda";
import { getAll } from "../services/location";
import { sendMessage } from "../services/queue";

export const PRODUCER_NAMES = {
  forecast: "forecast-preloader"
};

export const forecast: ScheduledHandler = async () => {
  for (const location of getAll()) {
    const body = { locationId: location.id };
    await sendMessage(process.env.QUEUE_URL!, PRODUCER_NAMES.forecast, body);
  }
};

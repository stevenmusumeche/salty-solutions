import { ScheduledHandler } from "aws-lambda";
import { getAll } from "../services/location";
import { sendMessage, sendMessageBatch } from "../services/queue";
import { format, addDays, startOfDay, subDays } from "date-fns";
import { chunk } from "lodash";

export const PRODUCER_NAMES = {
  forecast: "forecast-preloader",
  tide: "tide-preloader"
};

export const forecast: ScheduledHandler = async () => {
  for (const location of getAll()) {
    const body = { locationId: location.id };
    await sendMessage(process.env.QUEUE_URL!, PRODUCER_NAMES.forecast, body);
  }
};

export const tide: ScheduledHandler = async () => {
  console.log("Preloading tides", process.env.QUEUE_URL);

  const curDate = new Date();
  const startDate = subDays(startOfDay(curDate), 3).toISOString();
  const endDate = addDays(startOfDay(curDate), 4).toISOString();

  const uniqueStationIds = getAll().reduce((stations, location) => {
    location.tideStationIds.forEach(id => stations.add(id));
    return stations;
  }, new Set());

  const chunks = chunk([...uniqueStationIds], 10);
  for (const chunk of chunks) {
    await sendMessageBatch(
      process.env.QUEUE_URL!,
      PRODUCER_NAMES.tide,
      chunk.map(stationId => ({
        stationId,
        startDate,
        endDate
      }))
    );
  }
};

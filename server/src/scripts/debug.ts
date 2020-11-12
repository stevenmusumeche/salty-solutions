import { query } from "@urql/exchange-graphcache";
import { endOfDay, startOfDay } from "date-fns";
import { queryTimeSeriesData } from "../services/db";
import { getTidePredictions } from "../services/noaa/source-tide";

async function main() {
  const result = await queryTimeSeriesData(
    "noaa-predictions-8763535",
    startOfDay(new Date("2020-11-22")),
    endOfDay(new Date("2020-11-22"))
  );

  for (let item of result) {
    console.log(item);
  }

  // const data = await getTidePredictions(
  //   startOfDay(new Date()),
  //   endOfDay(new Date()),
  //   "8763535"
  // );
  // for (let item of data) {
  //   console.log(item);
  // }
}

main();

import { query } from "@urql/exchange-graphcache";
import { endOfDay, startOfDay } from "date-fns";
import { Platform } from "../generated/graphql";
import { queryTimeSeriesData } from "../services/db";
import { getTidePredictions } from "../services/noaa/source-tide";
import {
  AndroidPurchaseDAO,
  isAndroidSubscriptionActive,
} from "../services/purchase";

async function main() {
  const result = await isAndroidSubscriptionActive(
    "igjhhebdpcojfakelimleana.AO-J1OzT_HT_yII-TkHWsT3ctTTV53akf5qZjdj01lAUYzgrTW8ho42vg_RHxgnRhgOsH7SXdZVYE-409YzxLmj5WJPpE6z7ybEc0glfJWePBCbLI6PsWvw"
  );
  console.log(result);
  // try {
  //   const result = await scrapeData("caillou-lake");
  //   for (let item of result) {
  //     console.log(item);
  //   }
  // } catch (e) {
  //   console.error(e);
  // }
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

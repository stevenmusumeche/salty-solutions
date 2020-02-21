import { LocationEntity } from "./location";
import axios from "axios";
import axiosRetry from "axios-retry";
import cheerio from "cheerio";

axiosRetry(axios, { retries: 3, retryDelay: retryCount => retryCount * 500 });

export async function getSalinityMap(location: LocationEntity) {
  const url = `https://tidesandcurrents.noaa.gov/ofs/ofs_animation.shtml?ofsregion=ng&subdomain=${location.nowcastSubdomain}&model_type=salinity_nowcast`;
  const result = await axios.get(url);
  const $ = cheerio.load(result.data);
  const options = $("option", "select#Slider")
    .map((i, el) => {
      return $(el).attr("value");
    })
    .get();

  if (options.length === 0) throw new Error("unable to parse nowcast options");

  return `https://tidesandcurrents.noaa.gov${options[0]}`;
}

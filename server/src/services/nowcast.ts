import { LocationEntity } from "./location";
import axios from "axios";
import axiosRetry from "axios-retry";
import cheerio from "cheerio";
import { getCacheVal, setCacheVal } from "./db";

axiosRetry(axios, { retries: 3, retryDelay: (retryCount) => retryCount * 500 });

// main page URL examples:
//   - https://tidesandcurrents.noaa.gov/ofs/ofs_mapplots.html?ofsregion=ng&subdomain=0&model_type=salinity_nowcast
//   - https://tidesandcurrents.noaa.gov/ofs/ofs_mapplots.html?ofsregion=ng&subdomain=gb&model_type=salinity_nowcast

// options API call examples:
//   - https://cdn.tidesandcurrents.noaa.gov/ofs/ngofs2/wwwgraphics/NGOFS2_gom_all_sa_now_option
//   - https://cdn.tidesandcurrents.noaa.gov/ofs/ngofs2/wwwgraphics/NGOFS2_lc_all_sa_now_option

export async function getSalinityMap(
  nowcast: NonNullable<LocationEntity["nowcast"]>
): Promise<string> {
  const cacheKey = `nowcast-${nowcast.subdomain}`;
  const cachedData = await getCacheVal<string>(cacheKey, 6 * 60); // fresh for 6 hours
  if (cachedData) return cachedData;

  // returns html fragment with all options - we'll use the last one in the list since it is the most recent date
  const optionsUrl = `https://cdn.tidesandcurrents.noaa.gov/ofs/ngofs2/wwwgraphics/NGOFS2_${nowcast.tag}_all_sa_now_option`;
  const optionsResult = await axios.get(optionsUrl);
  const $ = cheerio.load(optionsResult.data);
  const options = $("option")
    .map((_, el) => {
      return $(el).attr("value");
    })
    .get();
  if (options.length === 0) throw new Error("unable to parse nowcast options");

  // the option value has the image defined like this: model_graphics/NGOFS2_gom_all_sa_now_202404140400.png
  // we need to remove "model_graphics/" and add the domain to it: https://cdn.tidesandcurrents.noaa.gov/ofs/ngofs2/wwwgraphics/{IMAGE_FILE}
  const imageUrl = `https://cdn.tidesandcurrents.noaa.gov/ofs/ngofs2/wwwgraphics/${options[
    options.length - 1
  ].replace("model_graphics/", "")}`;

  return setCacheVal(cacheKey, imageUrl);
}

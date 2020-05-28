import { LocationEntity } from "./location";
import axios from "axios";
import axiosRetry from "axios-retry";
import cheerio from "cheerio";
import fs from "fs";
// @ts-ignore
import exec from "await-exec"; // todo

axiosRetry(axios, { retries: 3, retryDelay: (retryCount) => retryCount * 500 });

// https://saveourlake.org/lpbf-programs/coastal/hydrocoast-maps/pontchartrain-basin/pontchartrain-basin-hydrocoast-map-archives/
export async function getSalinityMap(
  location: LocationEntity
): Promise<string> {
  const url =
    "https://saveourlake.org/lpbf-programs/coastal/hydrocoast-maps/pontchartrain-basin/";

  const result = await axios.get(url);
  const $ = cheerio.load(result.data);

  // salinity map URL has -3/? in it
  const salinityLinks = $("a")
    .map((i, el) => $(el).attr("href"))
    .get()
    .filter((val) => /download.*?\-3\/\?/.test(val));

  const pdfUrl = salinityLinks[0];

  const localPdf = "/tmp/salinity.pdf";
  const localJpg = "/tmp/salinity.jpg";
  await fetchPdf(pdfUrl, localPdf);
  await convertPdfToJpg(localPdf, localJpg);

  return pdfUrl;
}

const fetchPdf = async (url: string, output: string): Promise<void> => {
  const pdfResp = await axios({
    method: "get",
    url:
      "https://saveourlake.org/download/may-17-2020-3/?wpdmdl=17782&refresh=5ecff4dc5aa231590686940",
    responseType: "stream",
  });
  pdfResp.data.pipe(fs.createWriteStream(output));
};

const convertPdfToJpg = async (pdf: string, jpg: string) => {
  return await exec(
    `/opt/bin/gs -dSAFER -dBATCH -dNOPAUSE -sDEVICE=jpeg -r600 -sOutputFile=${jpg} -dDownScaleFactor=3 ${pdf}`
  );
};

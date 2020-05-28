import { LocationEntity } from "./location";
import axios from "axios";
import axiosRetry from "axios-retry";
import cheerio from "cheerio";
import fs from "fs";
import { exec } from "child_process";
import { S3 } from "aws-sdk";
import { getCacheVal, setCacheVal } from "./db";

const s3 = new S3();

axiosRetry(axios, { retries: 3, retryDelay: (retryCount) => retryCount * 500 });

const s3Bucket = "salty-solutions-assets";

// https://saveourlake.org/lpbf-programs/coastal/hydrocoast-maps/pontchartrain-basin/pontchartrain-basin-hydrocoast-map-archives/
export async function getSalinityMap(
  location: LocationEntity
): Promise<string> {
  const cacheKey = `hydrocoast`;
  const cachedData = await getCacheVal<string>(cacheKey, 60 * 24); // fresh for 1 day
  if (cachedData) return cachedData;

  const localPdf = "/tmp/salinity.pdf";
  const localJpg = "/tmp/salinity.jpg";

  const pdfUrl = await getPdfUrl(location);
  await fetchPdf(pdfUrl, localPdf);
  await convertPdfToJpg(localPdf, localJpg);
  const s3Url = await uploadToS3(
    localJpg,
    `hydrocoast-${new Date().getTime()}.jpg`
  );

  return setCacheVal(cacheKey, s3Url);
}

// https://saveourlake.org/lpbf-programs/coastal/hydrocoast-maps/pontchartrain-basin/pontchartrain-basin-hydrocoast-map-archives/
const getPdfUrl = async (location: LocationEntity): Promise<string> => {
  const url =
    "https://saveourlake.org/lpbf-programs/coastal/hydrocoast-maps/pontchartrain-basin/";

  const result = await axios.get(url);
  const $ = cheerio.load(result.data);

  // salinity map URL has -3/? in it
  const salinityLinks = $("a")
    .map((i, el) => $(el).attr("href"))
    .get()
    .filter((val) => /download.*?\-3\/\?/.test(val));

  return salinityLinks[0];
};

const fetchPdf = async (url: string, output: string): Promise<void> => {
  const pdfResp = await axios.request({
    url,
    method: "get",
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "application/pdf",
    },
  });
  await fs.promises.writeFile(output, pdfResp.data);
};

const convertPdfToJpg = async (pdf: string, jpg: string) => {
  const ghostscriptBinary = process.env.GHOSTSCRIPT_PATH || "/opt/bin/gs";
  await execAsync(
    `${ghostscriptBinary} -dSAFER -dBATCH -dNOPAUSE -sDEVICE=jpeg -r600 -sOutputFile=${jpg} -dDownScaleFactor=3 ${pdf}`
  );
};

async function uploadToS3(localJpg: string, key: string): Promise<string> {
  const stream = await fs.promises.readFile(localJpg);
  const awsResponse = await s3
    .upload({
      ACL: "public-read",
      Bucket: s3Bucket,
      Key: key,
      Body: stream,
    })
    .promise();
  return awsResponse.Location;
}

const execAsync = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(stdout);
    });
  });
};

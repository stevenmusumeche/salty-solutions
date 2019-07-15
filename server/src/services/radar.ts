import { LocationEntity } from "./location";
import { parse, format } from "date-fns";
import { orderBy, takeRight } from "lodash";
import xray from "x-ray";
import { Maybe } from "../generated/graphql";
var x = xray();

// todo: axios?

// documentation here:
// https://www.weather.gov/jetstream/ridge_download

export const getRadarImages = async (
  location: LocationEntity,
  numImages?: Maybe<number>
) => {
  const siteId = location.weatherGov.radarSiteId;

  // all images
  const url = `https://radar.weather.gov/ridge/RadarImg/N0R/${siteId}/`;
  let rawUrls: string[] = await x(url, "table", ["a@href"]);

  const allImages = rawUrls
    .map(url => {
      const matches = url.match(/.*?_([\d_]{13})_N0R.gif$/i);
      if (matches) {
        const date = parse(
          matches[1] + "+0000",
          "yyyyLLdd_HHmmxxxx",
          new Date()
        );
        return {
          imageUrl: url,
          timestamp: format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
        };
      }

      return undefined;
    })
    .filter(notUndefined);

  // latest image
  const latest = `http://radar.weather.gov/ridge/RadarImg/N0R/${siteId}_NCR_0.gif`;
  allImages.push({
    imageUrl: latest,
    timestamp: format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
  });

  const sorted = orderBy(allImages, ["timestamp"], ["asc"]);

  return numImages ? takeRight(sorted, numImages) : sorted;
};

export const getOverlays = (location: LocationEntity) => {
  const siteId = location.weatherGov.radarSiteId;
  return {
    topo: `https://radar.weather.gov/ridge/Overlays/Topo/Short/${siteId}_Topo_Short.jpg`,
    counties: `https://radar.weather.gov/ridge/Overlays/County/Short/${siteId}_County_Short.gif`,
    rivers: `https://radar.weather.gov/ridge/Overlays/Rivers/Short/${siteId}_Rivers_Short.gif`,
    highways: `https://radar.weather.gov/ridge/Overlays/Highways/Short/${siteId}_Highways_Short.gif`,
    cities: `https://radar.weather.gov/ridge/Overlays/Cities/Short/${siteId}_City_Short.gif`
  };
};

function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

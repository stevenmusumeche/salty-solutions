import { format, subDays } from "date-fns";
import { LocationEntity } from "./location";
import axios from "axios";
import axiosRetry from "axios-retry";
import { getCacheVal, setCacheVal } from "./db";
import { ModisMap, ModisSatellite } from "../generated/graphql";

axiosRetry(axios, { retries: 3, retryDelay: (retryCount) => retryCount * 500 });

export const getMaps = async (
  location: LocationEntity,
  numDays: number
): Promise<ModisMap[]> => {
  const cacheKey = `modis2-${location.modisArea}-${numDays}`;
  const cachedData = await getCacheVal<ModisMap[]>(cacheKey, 60 * 4); // fresh for 4 hours
  if (cachedData) return cachedData;

  let result: ModisMap[] = [];
  for (let i = 0; i < numDays; i++) {
    const date = subDays(new Date(), i);
    const satellites: ModisSatellite[] = [
      ModisSatellite.Aqua,
      ModisSatellite.Terra,
    ];

    satellites.forEach((satellite) => {
      const baseUrl = buildBaseUrl(date, location, satellite.toLowerCase());
      result.push({
        date: date.toISOString(),
        satellite,
        small: {
          url: baseUrl.replace("[SIZE]", "2000m"),
          width: 650,
          height: 750,
        },
        medium: {
          url: baseUrl.replace("[SIZE]", "1000m"),
          width: 1300,
          height: 1500,
        },
        large: {
          url: baseUrl.replace("[SIZE]", "250m"),
          width: 5200,
          height: 6000,
        },
      });
    });
  }

  result = await removeBrokenImages(result);

  const sorted = result.sort((a: ModisMap, b: ModisMap) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);

    if (aDate > bDate) return -1;
    else if (aDate < bDate) return 1;

    return 0;
  });

  return setCacheVal(cacheKey, sorted);
};

function buildBaseUrl(date: Date, location: LocationEntity, satellite: string) {
  // format: "http://ge.ssec.wisc.edu/modis-today/images/aqua/true_color/[YEAR]_[MONTH]_[DATE]_[DAY_OF_YEAR]/a1.[YEAR2][DAY_OF_YEAR].USA7.143.250m.jpg";
  return `http://ge.ssec.wisc.edu/modis-today/images/${satellite}/true_color/${format(
    date,
    "yyyy"
  )}_${format(date, "MM")}_${format(date, "dd")}_${format(date, "DDD")}/${
    satellite[0]
  }1.${format(date, "yy")}${format(date, "DDD")}.${
    location.modisArea
  }.143.[SIZE].jpg`;
}

async function removeBrokenImages(result: ModisMap[]): Promise<ModisMap[]> {
  const promises = await Promise.all(
    result.map(async (val) => {
      const imageUrl = val.small.url;
      let valid = false;
      await axios
        .head(imageUrl)
        .then(() => {
          valid = true;
        })
        .catch(() => (valid = false));
      return valid;
    })
  );

  return result.filter((_, index) => {
    return promises[index];
  });
}

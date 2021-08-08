import DataLoader from "dataloader";
import { getLatestValue } from "../services/db";
import { noaaDynamoKeys, NoaaProduct } from "../services/noaa/source";

interface Key {
  param: NoaaProduct;
  siteId: string;
}

const loader = new DataLoader<Key, string, string>(
  async (keys) => {
    const keysToFetch = new Set(
      keys.map((key) => noaaDynamoKeys[key.param](key.siteId))
    );
    const promises = [...keysToFetch].map((key) => getLatestValue(key));
    const result = await Promise.all(promises);
    const resultMap = result.reduce((acc, cur) => {
      if (!cur) return acc;
      acc[cur.key] = cur.createdAt.toISOString();
      return acc;
    }, {} as any);

    return keys.map((key) => resultMap[noaaDynamoKeys[key.param](key.siteId)]);
  },
  { cacheKeyFn: (key) => noaaDynamoKeys[key.param](key.siteId) }
);

export default loader;

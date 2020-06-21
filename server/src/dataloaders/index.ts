import DataLoader from "dataloader";
import { getLatestConditions, getConditions } from "../services/weather";
import { LocationEntity } from "../services/location";

export function createDataLoaders() {
  const latestConditionsLoader = new DataLoader<LocationEntity, any, string>(
    async (locations) => {
      const data = await getLatestConditions(locations[0]);
      return [data];
    },
    {
      cacheKeyFn: (location) => location.id,
      batch: false,
    }
  );

  interface ConditionsInput {
    location: LocationEntity;
    start: Date;
    end: Date;
  }
  const conditionsLoader = new DataLoader<ConditionsInput, any, string>(
    async (inputs) => {
      const data = await getConditions(
        inputs[0].location,
        inputs[0].start,
        inputs[0].end
      );
      return [data];
    },
    {
      batch: false,
      cacheKeyFn: (input) =>
        `${
          input.location.id
        }-${input.start.toISOString()}-${input.end.toISOString()}`,
    }
  );

  return {
    latestConditionsLoader,
    conditionsLoader,
  };
}

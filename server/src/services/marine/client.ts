import { LocationEntity } from "../location";
import { MarineForecast } from "../../generated/graphql";
import { getCacheVal } from "../db";

export const getForecast = async (
  location: LocationEntity
): Promise<MarineForecast[]> => {
  const data = await getCacheVal<MarineForecast[]>(
    `marine-forecast-${location.marineZoneId}`,
    60 * 24
  );

  if (!data) {
    throw new Error(
      `Unable to get marine forecast for ${location.id} from dynamodb`
    );
  }

  return data;
};

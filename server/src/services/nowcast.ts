import { LocationEntity } from "./location";
import xray from "x-ray";
var x = xray();

export async function getSalinityMap(location: LocationEntity) {
  const url = `https://tidesandcurrents.noaa.gov/ofs/ofs_animation.shtml?ofsregion=ng&subdomain=${location.nowcastSubdomain}&model_type=salinity_nowcast`;
  const result = await x(url, 'select[name="slide"]', [
    {
      options: x("option", [
        {
          text: "@text",
          value: "@value"
        }
      ])
    }
  ]);
  const path = result[0].options[0].value;
  return `https://tidesandcurrents.noaa.gov${path}`;
}

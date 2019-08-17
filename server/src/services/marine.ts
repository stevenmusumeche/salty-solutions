import xray from "x-ray";
import { parseWindDirection } from "./utils";
var x = xray();

export interface MarineForecast {
  timePeriod: string;
  forecast: {
    text: string;
    waterCondition?: string;
    windDirection?: { text: string; degrees: number };
    windSpeed?: { from: number; to: number };
  };
}
export const getForecast = async (location: any): Promise<MarineForecast[]> => {
  const url = `https://marine.weather.gov/MapClick.php?zoneid=${
    location.marineZoneId
  }&zflg=1`;
  const result = await x(url, "#detailed-forecast-body", {
    labels: [".row-forecast .forecast-label"],
    texts: [".row-forecast .forecast-text"]
  });

  const forecast = [];
  for (let i = 0; i < result.labels.length; i++) {
    const parsed = parseForecast(result.texts[i].trim());

    forecast.push({
      timePeriod: result.labels[i].trim(),
      forecast: { ...parsed }
    });
  }

  return forecast;
};

function parseForecast(forecastText: string) {
  let retVal: any = { text: forecastText };
  const waterConditionRegex = /(Bay|Lake) waters a? ?(?<data>.*?)\./im;
  let matches = forecastText.match(waterConditionRegex);
  if (matches && matches.groups) {
    retVal.waterCondition = matches.groups.data;
  }

  const windRegex = /^(?<direction>[\w]+) winds(?<qualifier> around| up to)? ((?<speed>[\d]+)|((?<speedStart>[\d]+) to (?<speedEnd>[\d]+))) knots( becoming)?/im;
  matches = forecastText.match(windRegex);
  if (matches && matches.groups) {
    retVal.windDirection = parseWindDirection(matches.groups.direction);
    retVal.windSpeed = matches.groups.speed
      ? {
          from:
            matches.groups.qualifier.trim() === "up to"
              ? 0
              : Number(matches.groups.speed),
          to: Number(matches.groups.speed)
        }
      : {
          from: Number(matches.groups.speedStart),
          to: Number(matches.groups.speedEnd)
        };
  }
  return retVal;
}

// calcasieu lake: https://forecast.weather.gov/shmrn.php?mz=gmz432
// sabine lake: https://forecast.weather.gov/shmrn.php?mz=gmz430
// vermillion bay: https://forecast.weather.gov/shmrn.php?mz=gmz435
// cocodrie: gmz550

// base page: https://www.weather.gov/lch/marine

import axios from "axios";
import { parseWindDirection } from "./utils";
import cheerio from "cheerio";

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
  try {
    const url = `https://marine.weather.gov/MapClick.php?zoneid=${location.marineZoneId}&zflg=1`;
    const result = await axios.get(url);
    const $ = cheerio.load(result.data);
    return $(".row-forecast", "#detailed-forecast-body")
      .map((i, el) => {
        return {
          timePeriod: $(".forecast-label", el)
            .text()
            .trim(),
          forecast: {
            ...parseForecast(
              $(".forecast-text", el)
                .text()
                .trim()
            )
          }
        };
      })
      .get();
  } catch (e) {
    console.error(e);
    return [];
  }
};

export function parseForecast(
  forecastText: string
): MarineForecast["forecast"] {
  let retVal: any = { text: forecastText };
  retVal.waterCondition = parseWaterCondition(forecastText);

  const windRegex = /^(?<direction>[\w]+) winds(?<qualifier> around| up to| near| rising to| building to)? ((?<speed>[\d]+)|((?<speedStart>[\d]+) to (?<speedEnd>[\d]+))) knots( becoming)?/im;
  let matches = forecastText.match(windRegex);
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
  } else {
    console.error({
      message: "Unable to parse wind speed/direction from marine forecast",
      forecastText
    });
  }
  return retVal;
}

function parseWaterCondition(forecastText: string): string | void {
  const inshoreRegex = /(Bay|Lake|Nearshore) waters a? ?(?<data>.*?)(\.| decreasing| increasing)/im;
  const offshoreRegex = /(seas|waves) (?<qualifier>(around)|(less than)|(building to) )?(?<numbers>.*?)(\.|(?<postQualifier>( or less)|( with occasional.*?))\.)/im;
  const inshoreMatches = forecastText.match(inshoreRegex);
  const offshoreMatches = forecastText.match(offshoreRegex);
  if (inshoreMatches && inshoreMatches.groups) {
    return inshoreMatches.groups.data;
  } else if (offshoreMatches && offshoreMatches.groups) {
    const g = offshoreMatches.groups;

    const [from, to] = g.numbers
      .replace(/foot|feet/im, "")
      .trim()
      .split(" to ");

    if (g.qualifier && g.qualifier.trim() === "around") {
      return `${from}-${from}`;
    } else if (g.qualifier && g.qualifier.trim() === "less than") {
      return `0-${from}`;
    } else if (g.postQualifier && g.postQualifier.trim() === "or less") {
      return `0-${from}`;
    } else {
      return `${from}-${to}`;
    }
  } else {
    console.error({ message: "Unable to parse water condition", forecastText });
  }
}
// calcasieu lake: https://forecast.weather.gov/shmrn.php?mz=gmz432
// sabine lake: https://forecast.weather.gov/shmrn.php?mz=gmz430
// vermillion bay: https://forecast.weather.gov/shmrn.php?mz=gmz435
// cocodrie: gmz550

// base page: https://www.weather.gov/lch/marine

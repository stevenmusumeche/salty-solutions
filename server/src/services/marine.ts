import xray from "x-ray";
var x = xray();

export const getForecast = async (
  location: any
): Promise<{ timePeriod: string; forecast: { text: string } }[]> => {
  const url = `http://marine.weather.gov/MapClick.php?zoneid=${
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
              : matches.groups.speed,
          to: matches.groups.speed
        }
      : { from: matches.groups.speedStart, to: matches.groups.speedEnd };
  }
  return retVal;
}

// calcasieu lake: https://forecast.weather.gov/shmrn.php?mz=gmz432
// sabine lake: https://forecast.weather.gov/shmrn.php?mz=gmz430
// vermillion bay: https://forecast.weather.gov/shmrn.php?mz=gmz435
// cocodrie: gmz550

// base page: https://www.weather.gov/lch/marine

function parseWindDirection(direction: string) {
  let text: string;
  let degrees: number;
  switch (direction.toLowerCase().trim()) {
    case "north":
      text = "N";
      degrees = 0;
      break;
    case "east":
      text = "E";
      degrees = 90;
      break;
    case "south":
      text = "S";
      degrees = 180;
      break;
    case "west":
      text = "W";
      degrees = 270;
      break;
    case "northeast":
      text = "NE";
      degrees = 45;
      break;
    case "northwest":
      text = "NW";
      degrees = 315;
      break;
    case "southeast":
      text = "SE";
      degrees = 135;
      break;
    case "southwest":
      text = "SW";
      degrees = 225;
      break;
    default:
      throw new Error("Unknown wind direction");
  }

  return { text, degrees };
}

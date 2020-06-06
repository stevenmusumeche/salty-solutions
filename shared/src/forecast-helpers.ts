import { chunk, isEqual } from "lodash";
import { CombinedForecastV2DetailFragment } from "./graphql";
import { addHours, isBefore } from "date-fns";

const getChunkLabel = (i: number): string => {
  switch (i) {
    case 0:
      return "12-6";
    case 1:
      return "6-noon";
    case 2:
      return "noon-6";
    case 3:
      return "6-12";
    default:
      return "";
  }
};

interface WindData {
  x: Date;
  y: number;
  gustY: number;
  directionDegrees: number;
  temperature?: number;
  rain?: number;
}
const createTimeChunks = (windData: WindData[], numChunks = 4) => {
  const rawChunks = chunk(windData, Math.ceil(windData.length / numChunks));
  return rawChunks.map((timeBucket, i) => {
    const windReductions = timeBucket.reduce(
      (acc, cur) => {
        if (cur.y < acc.min) {
          acc.min = cur.y;
        }
        if (cur.y > acc.max) {
          acc.max = cur.y;
        }
        acc.directions.push(cur.directionDegrees);

        if (cur.temperature) {
          acc.temperatures.push(cur.temperature);
        }

        if (cur.rain) {
          acc.rainTotal += cur.rain;
        }

        return acc;
      },
      {
        min: Infinity,
        max: -Infinity,
        directions: [] as number[],
        temperatures: [] as number[],
        // in millimeters
        rainTotal: 0,
      }
    );

    return {
      ...windReductions,
      label: getChunkLabel(i),
      averageDirection: averageAngle(windReductions.directions),
      averageTemperature:
        windReductions.temperatures.length > 0 &&
        windReductions.temperatures.reduce((a, b) => a + b, 0) /
          windReductions.temperatures.length,
    };
  });
};

export const prepareForecastData = (
  data: CombinedForecastV2DetailFragment,
  date: Date
) => {
  const chartData: WindData[] = data.wind.map((datum) => {
    return {
      x: new Date(datum.timestamp),
      y: datum.base,
      gustY: datum.gusts - datum.base,
      ySum: datum.gusts,
      directionDegrees: datum.direction.degrees,
      temperature: data.temperature.find((x) => x.timestamp === datum.timestamp)
        ?.temperature.degrees,
      rain: data.rain.find((x) => x.timestamp === datum.timestamp)?.mmPerHour,
    };
  });

  // make sure we have an entry for each hour
  let oldestData = chartData[0];
  for (let h = 0; h < 24; h++) {
    const targetTime = addHours(date, h);
    const match = chartData.find((x) => isEqual(x.x, targetTime));
    if (!match) {
      const toAdd = { ...oldestData, x: targetTime, fake: true };
      chartData.push(toAdd);
    } else {
      oldestData = match;
    }
  }

  // sort by date
  chartData.sort((a, b) => (isBefore(a.x, b.x) ? -1 : 1));

  // split into 4 time buckets
  const timeChunks = createTimeChunks(chartData);

  return { chartData, timeChunks };
};

function sum(a: number[]) {
  return a.reduce((acc, cur) => {
    acc += cur;
    return acc;
  }, 0);
}

function degreeToRadians(degrees: number) {
  return (Math.PI / 180) * degrees;
}

function averageAngle(degrees: number[]) {
  const base = Math.floor(
    (180 / Math.PI) *
      Math.atan2(
        sum(degrees.map(degreeToRadians).map(Math.sin)) / degrees.length,
        sum(degrees.map(degreeToRadians).map(Math.cos)) / degrees.length
      )
  );

  return base < 0 ? base + 360 : base;
}

export function degreesToCompass(degrees: number): string {
  var val = Math.floor(degrees / 22.5 + 0.5);
  var arr = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return arr[val % 16];
}

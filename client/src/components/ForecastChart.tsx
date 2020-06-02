import React, { FC } from "react";
import { CombinedForecastV2DetailFragment } from "../generated/graphql";
import {
  VictoryChart,
  VictoryGroup,
  VictoryLine,
  VictoryAxis,
  VictoryScatter,
  VictoryArea,
  VictoryStack,
  VictoryBar,
} from "victory";
import {
  differenceInDays,
  format,
  addHours,
  isEqual,
  isBefore,
} from "date-fns";
import { noDecimals } from "../hooks/utils";
import { chunk } from "lodash";
import Compass from "../assets/compass.svg";
import { WaterConditionIcon } from "./CombinedForecast";
import WaveIcon from "./WaveIcon";

interface Props {
  data: CombinedForecastV2DetailFragment;
  date: Date;
}

const ForecastChart: FC<Props> = ({ data, date }) => {
  const windData = data.wind.map((datum) => ({
    x: new Date(datum.timestamp),
    y: datum.base,
    gustY: datum.gusts - datum.base,
    directionDegrees: datum.direction.degrees,
  }));

  // make sure we have an entry for each hour
  let oldestData = windData[0];
  for (let h = 0; h < 24; h++) {
    const targetTime = addHours(date, h);
    const match = windData.find((x) => isEqual(x.x, targetTime));
    if (!match) {
      const toAdd = { ...oldestData, x: targetTime, fake: true };
      windData.push(toAdd);
    } else {
      oldestData = match;
    }
  }

  windData.sort((a, b) => (isBefore(a.x, b.x) ? -1 : 1));

  const timeBuckets = chunk(windData, Math.ceil(windData.length / 4));
  const bucketResults = timeBuckets.map((timeBucket) => {
    const windReductions = timeBucket.reduce(
      (acc, cur) => {
        if (cur.y < acc.min) {
          acc.min = cur.y;
        }
        if (cur.y > acc.max) {
          acc.max = cur.y;
        }
        acc.directions.push(cur.directionDegrees);
        return acc;
      },
      {
        min: Infinity,
        max: 0,
        directions: [] as number[],
      }
    );

    return {
      ...timeBucket,
      ...windReductions,
      averageDirection: averageAngle(windReductions.directions),
    };
  });

  const tickValues = [3, 6, 9, 12, 15, 18, 21].map((h) => addHours(date, h));

  return (
    <div>
      <VictoryChart
        padding={{ left: 25, top: 35, right: 25, bottom: 25 }}
        // domainPadding={{ y: [30, 30] }}
        domainPadding={{ y: 10, x: 7 }}
        style={{ parent: { touchAction: "auto" } }}
      >
        <VictoryAxis
          scale={{ x: "time" }}
          dependentAxis
          // tickValues={[5, 10, 15, 20]}
          style={{ tickLabels: { fontSize: 16, padding: 5 } }}
          tickFormat={noDecimals}
        />

        <VictoryAxis
          fixLabelOverlap={false}
          tickValues={tickValues}
          tickFormat={(date) => {
            const d = new Date(date);
            if (d.getHours() === 12) {
              return format(d, "b");
            }
            return format(d, "haaaaa");
          }}
          style={{
            tickLabels: { fontSize: 16, padding: 5 },
            // grid: {
            //   stroke: "#a0aec0",
            //   strokeDasharray: "3, 6",
            //   strokeWidth: 0.1,
            // },
          }}
        />

        <VictoryStack>
          <VictoryGroup data={windData}>
            <VictoryBar
              style={{
                data: {
                  width: 14,
                  fill: "#2b6cb0",
                },
              }}
            />

            <VictoryScatter
              dataComponent={<ArrowPoint style={{ fontSize: "2rem" }} />}
            />
          </VictoryGroup>
          <VictoryBar
            data={windData}
            y="gustY"
            style={{
              data: {
                width: 14,
                fill: "#2b6cb0",
                fillOpacity: 0.3,
              },
            }}
          />
        </VictoryStack>

        {/* <VictoryArea
          interpolation="step"
          data={gustData}
          style={{
            data: {
              fill: "#2b6cb0",
              fillOpacity: 0.3,
              strokeOpacity: 0.4,
            },
            parent: { border: "1px solid #ccc" },
          }}
        />
        <VictoryGroup data={windData}>
          <VictoryArea
            interpolation="step"
            style={{
              data: { fill: "#2b6cb0", stroke: "#2c5282" },
              parent: { border: "1px solid #ccc" },
            }}
          />

          <VictoryScatter
            dataComponent={<ArrowPoint style={{ fontSize: "2rem" }} />}
          />
        </VictoryGroup> */}
      </VictoryChart>
      <div className="flex mt-4 mb-4 text-xs justify-between items-center text-center flex-grow">
        {bucketResults.map((bucketResult, i) => {
          let label = "";
          switch (i) {
            case 0:
              label = "midnight";
              break;
            case 1:
              label = "6am";
              break;
            case 2:
              label = "noon";
              break;
            case 3:
              label = "6pm";
              break;
          }
          return (
            <div className="mr-2 last:mr-0" key={i}>
              <div className="uppercase text-gray-600">{label}</div>
              <div className="mt-2 mb-1">
                <WaveIcon min={bucketResult.min} max={bucketResult.max} />
              </div>
              {/* <img
                src={Compass}
                alt="compass"
                className="block m-auto h-12 w-12"
                style={{
                  transform: `rotate(${Math.abs(
                    bucketResult.averageDirection + 180
                  )}deg)`,
                  maxWidth: "5rem",
                }}
              /> */}
              <div className="mb-1">
                {Math.ceil(bucketResult.min)}-{Math.ceil(bucketResult.max)}{" "}
                {degreesToCompass(bucketResult.averageDirection)}
              </div>
              <div className="text-xl">{(Math.random() * 120).toFixed(0)}°</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastChart;

const ArrowPoint: React.FC<any> = ({ x, y, datum, index, data, ...props }) => {
  if (data.length > 8) {
    if (index % 3 !== 0) return null;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      width="2rem"
      height="2rem"
      x={x - 15}
      y={0}
      {...props}
    >
      <path
        fill="#4a5568"
        d="M304.31 109.98L459.68 529.72L303.06 427.61L154.59 534.11L304.31 109.98Z"
        style={{
          transformOrigin: "center",
          transform: `rotate(${Math.abs(datum.directionDegrees + 180)}deg)`,
        }}
      />
    </svg>
  );
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
  return (
    (180 / Math.PI) *
    Math.atan2(
      sum(degrees.map(degreeToRadians).map(Math.sin)) / degrees.length,
      sum(degrees.map(degreeToRadians).map(Math.cos)) / degrees.length
    )
  );
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

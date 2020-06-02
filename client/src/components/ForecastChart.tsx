import {
  degreesToCompass,
  prepareForecastData,
} from "@stevenmusumeche/salty-solutions-shared/dist/forecast-helpers";
import { addHours, format } from "date-fns";
import React, { FC } from "react";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryScatter,
  VictoryStack,
} from "victory";
import { CombinedForecastV2DetailFragment } from "../generated/graphql";
import { noDecimals } from "../hooks/utils";
import WaveIcon from "./WaveIcon";

interface Props {
  data: CombinedForecastV2DetailFragment;
  date: Date;
}

const ForecastChart: FC<Props> = ({ data, date }) => {
  const { chartData, timeChunks } = prepareForecastData(data, date);
  const yTicketVals = [3, 6, 9, 12, 15, 18, 21].map((h) => addHours(date, h));

  return (
    <div>
      <VictoryChart
        padding={{ left: 25, top: 35, right: 25, bottom: 25 }}
        domainPadding={{ y: 10, x: 7 }}
        style={{ parent: { touchAction: "auto" } }}
      >
        <VictoryAxis
          scale={{ x: "time" }}
          dependentAxis
          style={{
            tickLabels: { fontSize: 16, padding: 5 },
          }}
          tickFormat={noDecimals}
        />

        <VictoryAxis
          fixLabelOverlap={false}
          tickValues={yTicketVals}
          tickFormat={(date) => {
            const d = new Date(date);
            if (d.getHours() === 12) {
              return format(d, "b");
            }
            return format(d, "haaaaa");
          }}
          style={{
            tickLabels: { fontSize: 16, padding: 5 },
          }}
        />

        <VictoryStack>
          <VictoryGroup data={chartData}>
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
            data={chartData}
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
      </VictoryChart>
      <div className="flex mt-4 mb-4 text-xs justify-between items-center text-center flex-grow">
        {timeChunks.map((timeChunk, i) => {
          return (
            <div className="mr-2 last:mr-0" key={i}>
              <div className="uppercase text-gray-600">{timeChunk.label}</div>
              <div className="mt-2 mb-1">
                <WaveIcon min={timeChunk.min} max={timeChunk.max} />
              </div>
              <div className="mb-1">
                {Math.ceil(timeChunk.min)}-{Math.ceil(timeChunk.max)}{" "}
                {degreesToCompass(timeChunk.averageDirection)}
              </div>
              <div className="text-xl">
                {timeChunk.averageTemperature.toFixed(0)}°
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastChart;

const ArrowPoint: React.FC<any> = ({ x, y, datum, index, data, ...props }) => {
  if (index % 2 !== 0) return null;

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

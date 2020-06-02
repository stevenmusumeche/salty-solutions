import { prepareForecastData } from "@stevenmusumeche/salty-solutions-shared/dist/forecast-helpers";
import { CombinedForecastV2DetailFragment } from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
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
import { noDecimals } from "../hooks/utils";

interface Props {
  data: CombinedForecastV2DetailFragment;
  date: Date;
}

const ForecastChart: FC<Props> = ({ data, date }) => {
  const { chartData } = prepareForecastData(data, date);
  const yTicketVals = [3, 6, 9, 12, 15, 18, 21].map((h) => addHours(date, h));

  return (
    <VictoryChart
      padding={{ left: 25, top: 35, right: 25, bottom: 25 }}
      domainPadding={{ y: 35, x: 7 }}
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
      <VictoryScatter data={chartData} y="ySum" dataComponent={<RainDrop />} />
    </VictoryChart>
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

const RainDrop: React.FC<any> = ({ x, y, datum, index, data, ...props }) => {
  if (datum.rain === 0) return null;

  const renderDrop = (xOffset: number, yOffset: number) => (
    <svg
      key={yOffset}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 40"
      width="15"
      height="19"
      x={x - xOffset}
      y={y - yOffset}
    >
      <g>
        <path
          fill="#4299e1"
          stroke="#2b6cb0"
          strokeWidth="2"
          d="M16.82,3.43a1,1,0,0,0-1.64,0C14.34,4.64,7,15.4,7,20a9,9,0,0,0,18,0C25,15.4,17.66,4.64,16.82,3.43Z"
        />
      </g>
    </svg>
  );

  let numDrops = 1;
  if (datum.rain >= 6) {
    numDrops = 3;
  } else if (datum.rain >= 3) {
    numDrops = 2;
  }

  if (numDrops === 1) {
    return <>{renderDrop(7, 18)}</>;
  } else if (numDrops === 2) {
    return (
      <>
        {renderDrop(10, 22)}
        {renderDrop(5, 18)}
      </>
    );
  } else {
    return (
      <>
        {renderDrop(8, 18)}
        {renderDrop(4, 24)}
        {renderDrop(10, 28)}
      </>
    );
  }
};

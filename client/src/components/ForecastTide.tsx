import {
  SunDetailFieldsFragment,
  TideDetailFieldsFragment,
} from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import {
  buildDatasets,
  Y_PADDING,
} from "@stevenmusumeche/salty-solutions-shared/dist/tide-helpers";
import { addHours, format, isSameDay, startOfDay } from "date-fns";
import React, { FC, useMemo } from "react";
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryScatter,
} from "victory";

interface Props {
  stationName: string;
  tideData: TideDetailFieldsFragment[];
  sunData: SunDetailFieldsFragment[];
  date: Date;
}

const ForecastTide: FC<Props> = ({ tideData: rawTideData, sunData, date }) => {
  const curDaySunData: SunDetailFieldsFragment = useMemo(
    () =>
      sunData.filter(
        (x) =>
          startOfDay(new Date(x.sunrise)).toISOString() ===
          startOfDay(date).toISOString()
      )[0] || {},
    [sunData, date]
  );

  const curDayTideData = useMemo(
    () => rawTideData.filter((x) => isSameDay(new Date(x.time), date)),
    [rawTideData, date]
  );

  const yTickVals = [0, 3, 6, 9, 12, 15, 18, 21].map((h) => addHours(date, h));

  const { tideData, hiLowData, tideBoundaries } = buildDatasets(
    curDaySunData,
    curDayTideData,
    []
  );
  const { min, max } = tideBoundaries;

  return (
    <>
      <VictoryChart
        width={450}
        height={180}
        style={{
          parent: {
            backgroundColor: "white",
            touchAction: "auto",
          },
        }}
        padding={{
          top: 20,
          bottom: 30,
          left: 28,
          right: 25,
        }}
      >
        {/* time x-axis */}
        <VictoryAxis
          style={{
            tickLabels: { fontSize: 14, padding: 5 },
          }}
          tickFormat={(date) => {
            const d = new Date(date);
            if (d.getHours() === 12) {
              return format(d, "b");
            }
            return format(d, "haaaaa");
          }}
          tickValues={yTickVals}
          offsetY={30}
        />

        {/* tide height y-axis */}
        <VictoryAxis
          dependentAxis
          style={{
            tickLabels: { fontSize: 14, padding: 5 },
          }}
          crossAxis={false}
        />

        {/* actual tide line */}
        <VictoryArea
          data={tideData}
          y0={() => (min < 0 ? min - Y_PADDING : 0)}
          scale={{ x: "time", y: "linear" }}
          interpolation={"natural"}
          style={{
            data: {
              stroke: "#2c5282",
              strokeWidth: 1,
              fill: "#2b6cb0",
              fillOpacity: 0.75,
            },
          }}
        />

        {/* hi/low labels */}
        <VictoryScatter
          data={hiLowData}
          size={2.5}
          labels={(data) => format(new Date(data.x), "h:mma")}
          style={{
            data: {
              fill: "#2a4365",
            },
            labels: {
              fontSize: 12,
              fill: "#000000",
              textShadow:
                "0px 1px 0px #ffffff, 0px -1px 0px #ffffff, 1px 0px 0px #ffffff, -1px 0px 0px #ffffff",
            },
          }}
          labelComponent={
            <VictoryLabel
              dy={(datum) => {
                if (datum.y < 0) return -25;
                return 5;
              }}
            />
          }
        />
      </VictoryChart>
      <ChartLegend />
    </>
  );
};

export default ForecastTide;

const ChartLegend = () => {
  return (
    <div className="flex justify-center mt-2">
      <div
        className="flex tracking-tight tracking-wide uppercase font-normal text-gray-600 leading-none uppercase"
        style={{ fontSize: ".65rem" }}
      >
        <div className="flex items-center h-3">
          <div className="w-3 h-3 mr-1 rounded-sm bg-blue-700 flex-shrink-0"></div>
          <div className="">Tide Predictions</div>
        </div>
      </div>
    </div>
  );
};

import {
  SunDetailFieldsFragment,
  TideDetailFieldsFragment,
  SolunarDetailFieldsFragment,
} from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import {
  buildDatasets,
  Y_PADDING,
} from "@stevenmusumeche/salty-solutions-shared/dist/tide-helpers";
import {
  addHours,
  endOfDay,
  format,
  startOfDay,
  isWithinInterval,
  addDays,
} from "date-fns";
import React, { FC, useMemo } from "react";
import { VictoryArea, VictoryAxis, VictoryChart } from "victory";
import { renderBackgroundColor } from "./tide/tide-helpers";

interface Props {
  stationName: string;
  tideData: TideDetailFieldsFragment[];
  sunData: SunDetailFieldsFragment[];
  solunarData: SolunarDetailFieldsFragment[];
  date: Date;
}

const ForecastTide: FC<Props> = ({
  tideData: rawTideData,
  sunData,
  date,
  stationName,
  solunarData,
}) => {
  const curDayTideData = useMemo(
    () =>
      rawTideData.filter((x) =>
        isWithinInterval(new Date(x.time), {
          start: addHours(startOfDay(date), -2),
          end: addHours(startOfDay(addDays(date, 1)), 2),
        })
      ),
    [rawTideData, date]
  );

  const curDaySunData: SunDetailFieldsFragment = useMemo(
    () =>
      sunData.filter(
        (x) =>
          startOfDay(new Date(x.sunrise)).toISOString() ===
          startOfDay(date).toISOString()
      )[0] || {},
    [sunData, date]
  );

  const curDaySolunarData: SolunarDetailFieldsFragment = useMemo(
    () =>
      solunarData.filter(
        (x) =>
          startOfDay(new Date(x.date)).toISOString() ===
          startOfDay(date).toISOString()
      )[0] || {},
    [solunarData, date]
  );

  const yTickVals = useMemo(
    () => [0, 3, 6, 9, 12, 15, 18, 21].map((h) => addHours(date, h)),
    [date]
  );

  const {
    tideData,
    tideBoundaries,
    daylight,
    tidesWithinSolunarPeriod,
  } = useMemo(
    () => buildDatasets(curDaySunData, curDayTideData, [], curDaySolunarData),
    [curDaySunData, curDayTideData, curDaySolunarData]
  );
  const { min, max } = tideBoundaries;
  const y0 = min - Y_PADDING > 0 ? 0 : min - Y_PADDING;

  return (
    <div className="mx-4 mt-1">
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
        domain={{ x: [startOfDay(date), endOfDay(date)] }}
      >
        {/* background colors for night */}
        <VictoryArea
          data={[
            {
              x: startOfDay(date),
              y: max + Y_PADDING,
            },
            { x: endOfDay(date), y: max + Y_PADDING },
          ]}
          scale={{ x: "time", y: "linear" }}
          style={{
            data: {
              strokeWidth: 0,
              fill: "#4a5568",
            },
          }}
          y0={() => y0}
        />

        {/* background colors for time periods like night, dusk, etc */}
        {renderBackgroundColor(daylight, "#f7fafc", min)}

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
          y0={() => y0}
          scale={{ x: "time", y: "linear" }}
          interpolation={"natural"}
          style={{
            data: {
              stroke: "#2c5282",
              strokeWidth: 1,
              fill: "#5f8dc1",
            },
          }}
        />

        {/* solunar periods */}
        {tidesWithinSolunarPeriod.map((tides, i) => (
          <VictoryArea
            key={i}
            data={tides}
            y0={() => y0}
            scale={{ x: "time", y: "linear" }}
            interpolation={"natural"}
            style={{
              data: {
                stroke: "#2c5282",
                strokeWidth: 1,
                fill: "rgba(255,255,255, .25)",
              },
            }}
          />
        ))}
      </VictoryChart>
      <ChartLegend stationName={stationName} />
    </div>
  );
};

export default ForecastTide;

const ChartLegend: FC<{ stationName: string }> = ({ stationName }) => {
  return (
    <div>
      <div className="flex justify-center mt-2">
        <div
          className="flex uppercase font-normal text-gray-600 leading-none"
          style={{ fontSize: ".65rem" }}
        >
          <div className="flex items-center h-3">
            <div
              className="w-3 h-3 mr-1 rounded-sm bg-blue-700 flex-shrink-0"
              style={{ opacity: 0.75 }}
            ></div>
            <div className="">Tides for {stationName}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-2">
        <div
          className="flex uppercase font-normal text-gray-600 leading-none"
          style={{ fontSize: ".65rem" }}
        >
          <div className="flex items-center h-3">
            <div
              className="w-3 h-3 mr-1 rounded-sm bg-opacity-25 bg-blue-600 flex-shrink-0"
              style={{ opacity: 0.7 }}
            ></div>
            <div className="">Solunar Feeding Periods</div>
          </div>
        </div>
      </div>
    </div>
  );
};

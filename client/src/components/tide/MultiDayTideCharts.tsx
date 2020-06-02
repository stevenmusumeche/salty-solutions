import React from "react";
import { VictoryChart, VictoryAxis, VictoryLine, VictoryArea } from "victory";
import { renderBackgroundColor, Y_PADDING } from "./tide-helpers";
import useBreakpoints from "../../hooks/useBreakpoints";
import {
  addHours,
  startOfDay,
  format,
  subDays,
  isSameDay,
  addDays,
  endOfDay,
  getHours,
  isAfter,
  isBefore,
} from "date-fns";
import { buildDatasets } from "@stevenmusumeche/salty-solutions-shared/dist/tide-helpers";
import {
  SunDetailFieldsFragment,
  TideDetailFieldsFragment,
  WaterHeightFieldsFragment,
} from "@stevenmusumeche/salty-solutions-shared/dist/graphql";

interface Props {
  sunData: SunDetailFieldsFragment[];
  tideData: TideDetailFieldsFragment[];
  waterHeightData: WaterHeightFieldsFragment[];
  activeDate: Date;
  numDays: number;
  setActiveDate: (date: Date) => void;
}

interface Entry {
  x: Date;
  y: number;
}

const MultiDayTideCharts: React.FC<Props> = ({
  sunData,
  tideData: rawTideData,
  waterHeightData: rawWaterHeightData,
  activeDate,
  setActiveDate,
  numDays,
}) => {
  const { isSmall } = useBreakpoints();

  const dayPadding = Math.floor(numDays / 2);

  const { tideData, waterHeightData, tideBoundaries } = buildDatasets(
    sunData[0], // not actually used here
    rawTideData.filter(
      (x) =>
        isAfter(new Date(x.time), subDays(activeDate, dayPadding)) &&
        isBefore(new Date(x.time), endOfDay(addDays(activeDate, dayPadding)))
    ),
    rawWaterHeightData.filter(
      (x) =>
        isAfter(new Date(x.timestamp), subDays(activeDate, dayPadding)) &&
        isBefore(
          new Date(x.timestamp),
          endOfDay(addDays(activeDate, dayPadding))
        )
    )
  );
  const { min, max } = tideBoundaries;

  let daylights: Entry[][] = [];
  let timeTickValues = [];
  for (let i = -1 * dayPadding; i <= dayPadding; i++) {
    const curDate = subDays(new Date(activeDate), i);

    // filter data for current date
    const curSunData = sunData.filter(
      (x) =>
        startOfDay(new Date(x.sunrise)).toISOString() ===
        startOfDay(curDate).toISOString()
    )[0];

    if (!curSunData) continue;

    const curDayWaterHeight = rawWaterHeightData.filter((x) => {
      return isSameDay(new Date(x.timestamp), curDate);
    });

    const curDayTides = rawTideData.filter((x) =>
      isSameDay(new Date(x.time), curDate)
    );

    const { daylight } = buildDatasets(
      curSunData,
      curDayTides,
      curDayWaterHeight
    );

    daylights.push(daylight);

    timeTickValues.push(startOfDay(curDate));
    timeTickValues.push(addHours(startOfDay(curDate), 12));
  }

  return (
    <div className="relative mt-4 md:mt-0">
      {/* overlay for clicking to a day */}
      <div className="absolute inset-0 flex z-50 pl-3 md:pl-8 pr-2 md:pr-3 md:pt-3">
        {[...Array(numDays)].map((x, i) => (
          <button
            key={i}
            className="flex-grow flex-shrink-0"
            type="button"
            onClick={() => setActiveDate(addDays(activeDate, i - dayPadding))}
          ></button>
        ))}
      </div>
      <VictoryChart
        width={1000}
        height={isSmall ? 280 : 160}
        style={{
          parent: { backgroundColor: "white", touchAction: "auto" },
        }}
        padding={{
          top: 5,
          bottom: isSmall ? 50 : 30,
          left: isSmall ? 65 : 30,
          right: isSmall ? 30 : 10,
        }}
      >
        {/* background colors for night */}
        <VictoryArea
          data={[
            {
              x: startOfDay(subDays(activeDate, dayPadding)),
              y: max + Y_PADDING,
            },
            {
              x: endOfDay(addDays(activeDate, dayPadding)),
              y: max + Y_PADDING,
            },
          ]}
          scale={{ x: "time", y: "linear" }}
          style={{
            data: {
              strokeWidth: 0,
              fill: "#4a5568",
            },
          }}
          y0={() => (min < 0 ? min - Y_PADDING : 0)}
        />

        {/* background colors for time periods like night, dusk, etc */}
        {daylights.map((daylight, i) =>
          renderBackgroundColor(daylight, "#ebf8ff", min, max + Y_PADDING, i)
        )}

        {/* time x-axis */}
        <VictoryAxis
          style={{
            grid: {
              // only show gridlines on midnight
              strokeWidth: (date) => (getHours(new Date(date)) === 0 ? 1 : 0),
              stroke: "white",
            },
            tickLabels: { fontSize: isSmall ? 42 : 12 },
          }}
          // only show label at noon (center of the day block)
          tickFormat={(date) =>
            getHours(new Date(date)) === 12
              ? format(new Date(date), "EEEE (M/d)")
              : ""
          }
          tickValues={timeTickValues}
          offsetY={isSmall ? 50 : 30}
        />

        {/* tide height y-axis */}
        <VictoryAxis
          dependentAxis
          style={{
            tickLabels: { fontSize: isSmall ? 42 : 12 },
          }}
          tickCount={isSmall ? 3 : 4}
          crossAxis={false}
        />

        {/* actual tide line */}
        <VictoryLine
          data={tideData}
          scale={{ x: "time", y: "linear" }}
          interpolation={"natural"}
          style={{
            data: {
              strokeWidth: isSmall ? 4 : 2,
              stroke: "black",
            },
          }}
        />
        {/* observed water height */}
        <VictoryLine
          data={waterHeightData}
          scale={{ x: "time", y: "linear" }}
          interpolation={"natural"}
          style={{
            data: {
              strokeWidth: isSmall ? 4 : 2,
              stroke: "#3182ce",
            },
          }}
        />
      </VictoryChart>
    </div>
  );
};

export default MultiDayTideCharts;

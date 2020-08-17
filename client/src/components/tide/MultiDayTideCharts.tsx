import React from "react";
import { VictoryChart, VictoryAxis, VictoryLine, VictoryArea } from "victory";
import { renderBackgroundColor } from "./tide-helpers";
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
  isWithinInterval,
} from "date-fns";
import {
  buildDatasets,
  Y_PADDING,
} from "@stevenmusumeche/salty-solutions-shared/dist/tide-helpers";
import {
  SunDetailFieldsFragment,
  TideDetailFieldsFragment,
  WaterHeightFieldsFragment,
  SolunarDetailFieldsFragment,
} from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import { useMemo } from "react";
import { useCallback } from "react";

interface Props {
  sunData: SunDetailFieldsFragment[];
  tideData: TideDetailFieldsFragment[];
  waterHeightData: WaterHeightFieldsFragment[];
  activeDate: Date;
  numDays: number;
  setActiveDate: (date: Date) => void;
  solunarData: SolunarDetailFieldsFragment[];
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
  solunarData: rawSolunarData,
}) => {
  const { isSmall } = useBreakpoints();

  const dayPadding = Math.floor(numDays / 2);

  const rangeStartDate = subDays(activeDate, dayPadding);
  const rangeEndDate = endOfDay(addDays(activeDate, dayPadding));

  const isInRange = useCallback(
    (date: Date): boolean => {
      return isWithinInterval(date, {
        start: rangeStartDate,
        end: startOfDay(addDays(rangeEndDate, 1)),
      });
    },
    [rangeEndDate, rangeStartDate]
  );

  const curRangeTides = useMemo(
    () => rawTideData.filter((x) => isInRange(new Date(x.time))),
    [isInRange, rawTideData]
  );

  const curRangeWaterHeight = useMemo(
    () => rawWaterHeightData.filter((x) => isInRange(new Date(x.timestamp))),
    [isInRange, rawWaterHeightData]
  );

  const { tideData, waterHeightData, tideBoundaries } = buildDatasets(
    sunData[0], // not actually used here
    curRangeTides,
    curRangeWaterHeight
  );
  const { min, max } = tideBoundaries;

  let daylights: Entry[][] = [];
  let solunars: any[][] = [];
  let midnights: Date[] = [];
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

    const curDaySolunarData: SolunarDetailFieldsFragment =
      rawSolunarData.filter((x) => isSameDay(new Date(x.date), curDate))[0] ||
      {};

    const { daylight, tidesWithinSolunarPeriod } = buildDatasets(
      curSunData,
      curDayTides,
      curDayWaterHeight,
      curDaySolunarData
    );

    daylights.push(daylight);
    solunars.push(tidesWithinSolunarPeriod);
    midnights.push(endOfDay(curDate));

    timeTickValues.push(startOfDay(curDate));
    timeTickValues.push(addHours(startOfDay(curDate), 12));
  }

  const y0 = min - Y_PADDING > 0 ? 0 : min - Y_PADDING;

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
        domain={{
          x: [rangeStartDate, rangeEndDate],
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
          y0={() => y0}
        />

        {/* background colors for time periods like night, dusk, etc */}
        {daylights.map((daylight, i) =>
          renderBackgroundColor(daylight, "#ebf8ff", min, max + Y_PADDING, i)
        )}

        {/* time x-axis */}
        <VictoryAxis
          style={{
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
        <VictoryArea
          data={tideData}
          scale={{ x: "time", y: "linear" }}
          interpolation={"natural"}
          style={{
            data: {
              stroke: "#2c5282",
              strokeWidth: isSmall ? 4 : 2,
              fill: "#5f8dc1",
            },
          }}
          y0={() => y0}
        />

        {/* solunar periods */}
        {solunars.map((solunar, j) =>
          solunar.map((tides, i) => (
            <VictoryArea
              key={`${j}-${i}`}
              data={tides}
              scale={{ x: "time", y: "linear" }}
              interpolation={"natural"}
              style={{
                data: {
                  fill: "rgba(255,255,255, .25)",
                  stroke: "#2c5282",
                  strokeWidth: isSmall ? 4 : 2,
                },
              }}
              y0={() => y0}
            />
          ))
        )}

        {/* observed water height */}
        <VictoryLine
          data={waterHeightData}
          scale={{ x: "time", y: "linear" }}
          interpolation={"natural"}
          style={{
            data: {
              strokeWidth: isSmall ? 4 : 2,
              stroke: "black",
            },
          }}
        />

        {midnights.map((midnight) => (
          <VictoryLine
            key={midnight.toISOString()}
            x={() => midnight}
            style={{ data: { stroke: "white", strokeWidth: isSmall ? 4 : 1 } }}
          />
        ))}
      </VictoryChart>
    </div>
  );
};

export default MultiDayTideCharts;

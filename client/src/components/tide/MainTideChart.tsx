import {
  SolunarDetailFieldsFragment,
  SunDetailFieldsFragment,
  TideDetailFieldsFragment,
  WaterHeightFieldsFragment,
} from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import {
  buildDatasets,
  Y_PADDING,
} from "@stevenmusumeche/salty-solutions-shared/dist/tide-helpers";
import {
  addHours,
  endOfDay,
  format,
  isAfter,
  isBefore,
  startOfDay,
} from "date-fns";
import React from "react";
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
} from "victory";
import useBreakpoints from "../../hooks/useBreakpoints";
import { renderBackgroundColor } from "./tide-helpers";

interface Props {
  sunData: SunDetailFieldsFragment;
  curDayTides: TideDetailFieldsFragment[];
  waterHeightData: WaterHeightFieldsFragment[];
  date: Date;
  solunarData: SolunarDetailFieldsFragment;
}

const MainTideChart: React.FC<Props> = ({
  sunData,
  curDayTides,
  waterHeightData: rawWaterHeightData,
  date,
  solunarData,
}) => {
  const { isSmall } = useBreakpoints();

  const {
    dawn,
    dusk,
    daylight,
    tideData,
    hiLowData,
    waterHeightData,
    tideBoundaries,
    tidesWithinSolunarPeriod,
  } = buildDatasets(sunData, curDayTides, rawWaterHeightData, solunarData);
  const { min, max } = tideBoundaries;

  let timeTickValues = [];
  for (let i = 0; i <= 24; i += isSmall ? 4 : 2) {
    timeTickValues.push(addHours(startOfDay(date), i));
  }

  const y0 = min - Y_PADDING > 0 ? 0 : min - Y_PADDING;

  return (
    <VictoryChart
      width={450}
      height={isSmall ? 250 : 200}
      style={{
        parent: { backgroundColor: "white", touchAction: "auto" },
      }}
      padding={{
        top: 5,
        bottom: 30,
        left: isSmall ? 50 : 30,
        right: isSmall ? 30 : 10,
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
      {renderBackgroundColor(daylight, "#ebf8ff", min)}
      {renderBackgroundColor(dawn, "#a0aec0", min)}
      {renderBackgroundColor(dusk, "#a0aec0", min)}

      {/* actual tide line */}
      <VictoryArea
        data={tideData}
        scale={{ x: "time", y: "linear" }}
        interpolation={"natural"}
        style={{
          data: {
            stroke: "#2c5282",
            strokeWidth: isSmall ? 2 : 1,
            fill: "#5f8dc1",
          },
        }}
        y0={() => y0}
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
              fill: "rgba(255,255,255, .25)",
              stroke: "#2c5282",
              strokeWidth: isSmall ? 2 : 1,
            },
          }}
        />
      ))}

      {/* observed water height */}
      <VictoryLine
        data={waterHeightData}
        scale={{ x: "time", y: "linear" }}
        interpolation={"natural"}
        style={{
          data: {
            strokeWidth: isSmall ? 2 : 1,
            stroke: "black",
          },
        }}
      />

      {/* hi and low tide labels */}
      {!isSmall && (
        <VictoryScatter
          data={hiLowData}
          size={1.5}
          labels={({ datum }) =>
            format(new Date(datum.x), "h:mma") + `\n${datum.y.toFixed(1)}ft`
          }
          style={{
            data: {
              fill: "transparent",
            },
            labels: {
              fontSize: 8,
              padding: 2,
              fill: ({ datum }) => {
                const isNight =
                  isAfter(datum.x, new Date(sunData.nauticalDusk)) ||
                  isBefore(datum.x, new Date(sunData.nauticalDawn));

                return isNight ? "#a0aec0" : "#000000";
              },
              textShadow: ({ datum }) => {
                const isNight =
                  isAfter(datum.x, new Date(sunData.nauticalDusk)) ||
                  isBefore(datum.x, new Date(sunData.nauticalDawn));

                return isNight ? "0 0 5px #000000" : "0 0 5px #ffffff";
              },
            },
          }}
        />
      )}

      {/* time x-axis */}
      <VictoryAxis
        style={{
          grid: {
            strokeWidth: 1,
            stroke: "black",
            strokeDasharray: isSmall ? "1 10" : "1 20",
          },
          tickLabels: { fontSize: isSmall ? 20 : 8 },
        }}
        tickFormat={(date) => format(new Date(date), "ha").toLowerCase()}
        tickValues={timeTickValues}
        offsetY={30}
      />
      {/* tide height y-axis */}
      <VictoryAxis
        dependentAxis
        style={{
          tickLabels: { fontSize: isSmall ? 20 : 8 },
        }}
        tickCount={isSmall ? 6 : 10}
        crossAxis={false}
      />
    </VictoryChart>
  );
};

export default MainTideChart;

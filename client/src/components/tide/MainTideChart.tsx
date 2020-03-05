import {
  addHours,
  endOfDay,
  format,
  isAfter,
  isBefore,
  startOfDay
} from "date-fns";
import React from "react";
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter
} from "victory";
import {
  SunDetailFieldsFragment,
  TideDetailFieldsFragment,
  WaterHeightFieldsFragment
} from "../../generated/graphql";
import useBreakpoints from "../../hooks/useBreakpoints";
import {
  buildDatasets,
  renderBackgroundColor,
  Y_PADDING
} from "./tide-helpers";

interface Props {
  sunData: SunDetailFieldsFragment;
  tideData: TideDetailFieldsFragment[];
  waterHeightData: WaterHeightFieldsFragment[];
  date: Date;
}

const MainTideChart: React.FC<Props> = ({
  sunData,
  tideData: rawTideData,
  waterHeightData: rawWaterHeightData,
  date
}) => {
  const { isSmall } = useBreakpoints();

  const {
    dawn,
    dusk,
    daylight,
    tideData,
    hiLowData,
    waterHeightData,
    tideBoundaries
  } = buildDatasets(sunData, rawTideData, rawWaterHeightData);
  const { min, max } = tideBoundaries;

  let timeTickValues = [];
  for (let i = 0; i <= 24; i += isSmall ? 4 : 2) {
    timeTickValues.push(addHours(startOfDay(date), i));
  }

  return (
    <VictoryChart
      width={450}
      height={isSmall ? 250 : 200}
      style={{
        parent: { backgroundColor: "white", touchAction: "auto" }
      }}
      padding={{
        top: 5,
        bottom: 30,
        left: isSmall ? 50 : 30,
        right: isSmall ? 30 : 10
      }}
    >
      {/* background colors for night */}
      <VictoryArea
        data={[
          {
            x: startOfDay(date),
            y: max + Y_PADDING
          },
          { x: endOfDay(date), y: max + Y_PADDING }
        ]}
        scale={{ x: "time", y: "linear" }}
        style={{
          data: {
            strokeWidth: 0,
            fill: "#4a5568"
          }
        }}
        y0={() => (min < 0 ? min - Y_PADDING : 0)}
      />

      {/* background colors for time periods like night, dusk, etc */}
      {renderBackgroundColor(daylight, "#ebf8ff", min)}
      {renderBackgroundColor(dawn, "#a0aec0", min)}
      {renderBackgroundColor(dusk, "#a0aec0", min)}

      {/* time x-axis */}
      <VictoryAxis
        style={{
          grid: {
            strokeWidth: 1,
            stroke: "#718096",
            strokeDasharray: isSmall ? "2 4" : "2 10"
          },
          tickLabels: { fontSize: isSmall ? 20 : 8 }
        }}
        tickFormat={date => format(new Date(date), "ha").toLowerCase()}
        tickValues={timeTickValues}
        offsetY={30}
      />
      {/* tide height y-axis */}
      <VictoryAxis
        dependentAxis
        style={{
          grid: {
            stroke: "718096",
            strokeWidth: y => (isSmall ? 0 : y === 0 && min < 0 ? 2 : 1),
            strokeDasharray: y => (y === 0 && min < 0 ? "12 6" : "2 10")
          },
          tickLabels: { fontSize: isSmall ? 20 : 8 }
        }}
        tickCount={isSmall ? 6 : 10}
        crossAxis={false}
      />
      {/* actual tide line */}
      <VictoryLine
        data={tideData}
        scale={{ x: "time", y: "linear" }}
        interpolation={"natural"}
        style={{
          data: {
            strokeWidth: isSmall ? 2 : 1,
            stroke: "black"
          }
        }}
      />
      {/* observed water height */}
      <VictoryLine
        data={waterHeightData}
        scale={{ x: "time", y: "linear" }}
        interpolation={"natural"}
        style={{
          data: {
            strokeWidth: isSmall ? 2 : 1,
            stroke: "#3182ce"
          }
        }}
      />
      {/* hi and low tide labels */}
      {!isSmall && (
        <VictoryScatter
          data={hiLowData}
          size={1.5}
          labels={data =>
            format(new Date(data.x), "h:mma") + `\n${data.y.toFixed(1)}ft`
          }
          style={{
            data: {
              fill: "transparent"
            },
            labels: {
              fontSize: 8,
              padding: 2,
              fill: datum => {
                const isNight =
                  isAfter(datum.x, new Date(sunData.nauticalDusk)) ||
                  isBefore(datum.x, new Date(sunData.nauticalDawn));

                return isNight ? "#a0aec0" : "#000000";
              },
              textShadow: datum => {
                const isNight =
                  isAfter(datum.x, new Date(sunData.nauticalDusk)) ||
                  isBefore(datum.x, new Date(sunData.nauticalDawn));

                return isNight ? "0 0 5px #000000" : "0 0 5px #ffffff";
              }
            }
          }}
        />
      )}
    </VictoryChart>
  );
};

export default MainTideChart;

import {
  addHours,
  endOfDay,
  format,
  isAfter,
  isBefore,
  startOfDay,
  isSameDay,
} from "date-fns";
import React from "react";
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryLabel,
} from "victory";

import useBreakpoints from "../../hooks/useBreakpoints";
import {
  buildDatasets,
  Y_PADDING,
} from "@stevenmusumeche/salty-solutions-shared/dist/tide-helpers";
import { renderBackgroundColor } from "./tide-helpers";
import {
  SunDetailFieldsFragment,
  TideDetailFieldsFragment,
  WaterHeightFieldsFragment,
  SolunarDetailFieldsFragment,
  SolunarPeriodFieldsFragment,
} from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import { differenceInMinutes, addMinutes } from "date-fns/esm";

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
  } = buildDatasets(sunData, curDayTides, rawWaterHeightData);
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

      {/* {solunarData.majorPeriods.map((period, i) =>
        renderSolunarPeriod(new Date(period.start))
      )}
      {solunarData.majorPeriods.map((period, i) =>
        renderSolunarPeriod(new Date(period.end))
      )}
      {solunarData.minorPeriods.map((period, i) =>
        renderSolunarPeriod(new Date(period.start))
      )}
      {solunarData.minorPeriods.map((period, i) =>
        renderSolunarPeriod(new Date(period.end))
      )} */}

      {/* time x-axis */}
      <VictoryAxis
        style={{
          // grid: {
          //   strokeWidth: 1,
          //   stroke: "#718096",
          //   strokeDasharray: isSmall ? "2 4" : "2 10",
          // },
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
          // grid: {
          //   stroke: "718096",
          //   strokeWidth: (y) => (isSmall ? 0 : y === 0 && min < 0 ? 2 : 1),
          //   strokeDasharray: (y) => (y === 0 && min < 0 ? "12 6" : "2 10"),
          // },
          tickLabels: { fontSize: isSmall ? 20 : 8 },
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
            strokeWidth: isSmall ? 2 : 1,
            stroke: "#3182ce",
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

      {/* <VictoryLabel
        text={() => "Major Feeding"}
        datum={{ x: new Date(solunarData.majorPeriods[0].start), y: y0 + 0.08 }}
        style={{ fontSize: 6, backgroundColor: "red" }}
      /> */}

      {solunarData.majorPeriods.map((period) => {
        const start = new Date(period.start);
        const end = new Date(period.end);
        const diff = differenceInMinutes(end, start);
        const midPoint = addMinutes(start, diff / 2);

        let data = [];
        if (isSameDay(start, date)) {
          data.push({ x: start, y: y0 });
        }
        if (isSameDay(midPoint, date)) {
          data.push({ x: midPoint, y: y0 });
        }

        return [
          <VictoryScatter
            key={period.start}
            data={data}
            dataComponent={<Fish />}
          />,
          period.weight > 0 ? (
            <VictoryScatter
              key={period.start}
              data={data}
              dataComponent={<Fish offset={true} />}
            />
          ) : null,
        ];
      })}

      {solunarData.minorPeriods.map((period) => {
        const start = new Date(period.start);
        let data = [];
        if (isSameDay(start, date)) {
          data.push({ x: start, y: y0 });
        }
        return (
          <VictoryScatter
            key={period.start}
            data={data}
            dataComponent={<Fish />}
          />
        );
      })}
    </VictoryChart>
  );
};

export default MainTideChart;

const renderSolunarPeriod = (date: Date) => {
  return (
    <VictoryLine
      key={date.toISOString()}
      x={() => date}
      style={{
        data: {
          stroke: "#718096",
          strokeWidth: (y) => 0.5,
          strokeDasharray: (y) => "2 4",
        },
      }}
    />
  );
  // return (
  //   <VictoryArea
  //     key={period.start}
  //     data={[
  //       {
  //         x: new Date(period.start),
  //         y: max,
  //       },
  //       {
  //         x: new Date(period.end),
  //         y: max,
  //       },
  //     ]}
  //     scale={{ x: "time", y: "linear" }}
  //     style={{
  //       data: {
  //         strokeWidth: 5,
  //         stroke: "black",
  //         fill: "transparent",
  //       },
  //     }}
  //     y0={() => y0}
  //   />
  // );
};

const Fish: React.FC<any> = ({
  x,
  y,
  datum,
  index,
  data,
  offset,
  ...props
}) => {
  return (
    <svg
      height="50px"
      width="15px"
      x={x + 1}
      y={y - 29 - (offset ? 7 : 0)}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 25 81 30"
      version="1.1"
    >
      <path
        fill="#4FD1C5"
        d="m 40.463031,26.262212 c 0.084,-0.11855 0.21241,-0.26181 0.3853,-0.14819 1.11638,0.33096 1.99565,1.13613 2.88974,1.84251 0.54831,0.41988 1.06204,0.87927 1.54613,1.36831 1.12132,1.02252 2.1636,2.11914 3.28492,3.14166 0.16301,0.12349 0.31614,0.29638 0.52855,0.34578 0.87927,0.19759 1.79312,0.19759 2.69215,0.22723 3.95671,-0.0296 7.91343,0.35566 11.80099,1.10156 0.84964,0.0939 1.65975,0.41493 2.51432,0.51867 1.55108,0.40505 3.10709,0.78541 4.63346,1.26951 0.93361,0.3359 1.91662,0.51373 2.85022,0.84469 0.80518,0.25686 1.59059,0.57795 2.36613,0.90891 0.70638,0.37048 1.45228,0.67674 2.1142,1.14107 0.55325,0.38036 1.19541,0.81506 1.35349,1.5165 0.14325,0.34084 -0.16302,0.58783 -0.37542,0.79529 -0.40012,0.28651 -0.88421,0.41 -1.32385,0.60759 0.005,0.0346 0.0148,0.0988 0.0247,0.13337 0.50879,0.079 0.99288,-0.11855 1.50168,-0.13337 0.31614,0.12349 0.40505,0.59771 0.14819,0.82987 -0.32108,0.52855 -0.88915,0.82988 -1.42264,1.10156 -0.63723,0.35072 -1.34855,0.52855 -2.03517,0.76566 -4.125369,1.270669 -8.225777,1.732499 -12.14184,2.93419 -0.2865,0.0642 -0.42975,0.32602 -0.62734,0.50879 -0.26675,0.25687 -0.44952,0.58289 -0.63723,0.89903 -0.64216,0.89409 -1.33372,1.74867 -2.0648,2.5736 -0.30626,0.2618 -0.65698,0.66686 -1.1065,0.49397 -0.3359,-0.0939 -0.48409,-0.44457 -0.51867,-0.76072 -0.0296,-0.87927 -0.0692,-1.76348 0.01,-2.64275 -1.01758,0.15313 -2.03023,0.36554 -3.06263,0.41 -0.73602,0.0445 -1.45722,0.19759 -2.19323,0.27662 -0.92867,0.10374 -1.8524,0.29639 -2.79589,0.30627 -1.81782,-0.01 -3.64057,0.17783 -5.45345,-0.0395 -0.14325,0.44951 -0.44952,0.81011 -0.72614,1.18059 -0.37048,0.41988 -0.58289,0.99289 -1.07686,1.28927 -0.34084,0.16795 -0.59771,-0.17289 -0.71132,-0.44457 -0.0889,-0.10374 -0.16301,-0.40012 -0.3606,-0.33097 -1.279977,0.893697 -2.017166,2.19186 -3.5813,3.13675 -0.20747,0.13831 -0.50385,0.12843 -0.68662,-0.0445 -0.40506,-0.47915 -0.38036,-1.14108 -0.23711,-1.71902 0.219344,-1.640446 0.12652,-2.39903 0.97309,-3.77888 -0.51867,-0.10867 -1.04722,-0.12349 -1.57083,-0.19265 -1.42758,-0.29144 -2.87492,-0.44457 -4.3272,-0.55819 -1.21023,-0.10867 -2.43528,-0.27168 -3.65046,-0.0988 -0.36554,0.0296 -0.66192,0.24698 -0.97806,0.39517 -0.58783,0.27169 -1.14108,0.59771 -1.67951,0.95337 -0.43469,0.29145 -0.92372,0.48409 -1.3683,0.75578 -0.80517,0.46927 -1.63999,0.87927 -2.47974,1.26951 -0.81505,0.28156 -1.57083,0.71626 -2.37107,1.04228 -0.3359,0.13337 -0.75577,0.13831 -1.06204,-0.0642 -0.40999,-0.3853 -0.52855,-0.95336 -0.71132,-1.46216 -0.21241,-0.67674 -0.53349,-1.3189 -0.64216,-2.02528 -0.079,-0.7706 -0.079,-1.54613 0.0198,-2.31673 0.0296,-0.19265 -0.0296,-0.38036 -0.10374,-0.55325 0.13338,-0.14819 0.21735,-0.40506 0.47916,-0.34578 0.58288,-0.0296 1.17565,-0.11361 1.66962,-0.44458 -0.46927,-0.21734 -0.98794,-0.27168 -1.48685,-0.38035 -0.65699,-0.14326 -1.32385,-0.20747 -1.99071,-0.27663 -0.95831,-0.0938 -1.91661,0.0247 -2.86504,0.14819 -0.47915,0.079 -0.90891,0.32602 -1.38312,0.43964 -0.83976,0.20747 -1.63505,0.56807 -2.4846801,0.76565 -0.8694,0.20253 -1.67457,0.60759 -2.5291401,0.87434 -0.67674,0.20252 -1.35349,0.45939 -2.05987,0.52361 -0.96324,0.11361 -1.92649,0.22722 -2.88973,0.34084 -0.44458,0.01 -0.88421,-0.0148 -1.32385,-0.0445 0.13337,-0.33096 0.29144,-0.65698 0.2865,-1.02252 0.5267991,-1.900102 1.0667197,-3.488689 1.63011,-5.32502 0.0494,-0.35566 -0.0939,-0.69156 -0.12843,-1.03735 -1.016715,-2.375293 -0.8406543,-4.189445 -0.86447,-6.86127 0.0642,-0.33096 0.52855,-0.34578 0.79529,-0.32108 1.50662,0.17289 2.99842,0.58782 4.36178,1.25963 0.8644501,0.38036 1.7338401,0.76071 2.5242001,1.27939 1.0719201,0.58288 1.9956401,1.46709 3.1910601,1.80793 0.97806,0.25687 1.98083,0.46928 2.99841,0.48904 1.0571,-0.005 2.12408,0.01 3.16636,-0.18277 -0.56313,-0.20253 -1.18553,-0.26181 -1.70914,-0.56807 -0.26181,-0.14819 -0.14325,-0.54337 0.0395,-0.71132 0.37047,-0.4594 1.01264,-0.45446 1.54613,-0.49397 0.47421,-0.0296 0.92867,0.15313 1.38312,0.26674 0.85457,0.24205 1.68939,0.68662 2.60323,0.57301 0.78048,-0.12349 1.57578,-0.12349 2.36119,-0.25193 0.80024,-0.12843 1.60541,-0.20253 2.40071,-0.37542 0.54831,0 1.09662,-0.0642 1.63011,-0.18771 0.84963,-0.14325 1.71408,-0.20746 2.54889,-0.41493 1.12626,-0.23711 2.27721,-0.29145 3.40841,-0.50879 0.68662,-0.1482 1.39794,-0.21735 2.07468,-0.41988 -0.60264,-0.18277 -1.23493,-0.26181 -1.84251,-0.42482 -0.42976,-0.15807 -0.87433,-0.2618 -1.29915,-0.42975 -0.01,-0.23711 0.0939,-0.4594 0.21241,-0.65699 0.26674,-0.31614 0.66192,-0.48903 0.94843,-0.78047 1.567821,-1.734454 4.938577,-5.357179 5.04345,-5.87334 z"
      ></path>
    </svg>
  );
};

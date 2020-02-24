import React from "react";
import ConditionCard from "./ConditionCard";
import { useCurrentWindData } from "../hooks/useWindData";
import { subHours, differenceInCalendarDays } from "date-fns";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryGroup,
  VictoryScatter
} from "victory";
import ErrorIcon from "../assets/error.svg";
import { CombinedError } from "urql";
import MiniGraphWrapper from "./MiniGraphWrapper";

interface Props {
  locationId: string;
  date: Date;
}
const CurrentWindSummaryCard: React.FC<Props> = ({ locationId, date }) => {
  const {
    curValue,
    curDetail,
    curDirectionValue,
    fetching,
    error
  } = useCurrentWindData(locationId, subHours(date, 48), date);

  let graphDisplayVal = buildGraphDisplayVal(fetching, error, curDetail);

  console.log(curDetail);

  return (
    <ConditionCard
      fetching={fetching}
      error={error}
      label="Wind (mph)"
      className="wind-summary"
    >
      <div>
        {curValue && (
          <div>
            {curValue}
            <div className="absolute right-0 top-0 p-2 text-lg md:text-2xl">
              {curDirectionValue}
            </div>
          </div>
        )}
        <div>{graphDisplayVal}</div>
      </div>
    </ConditionCard>
  );
};

export default CurrentWindSummaryCard;

const ArrowPoint: React.FC<any> = ({ x, y, datum, index, ...props }) => {
  if (index % 3 !== 0) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      x={x - 12}
      y={y - 19}
      {...props}
    >
      <path
        fill="black"
        d="M412.6 227.1L278.6 89c-5.8-6-13.7-9-22.4-9h-.4c-8.7 0-16.6 3-22.4 9l-134 138.1c-12.5 12-12.5 31.3 0 43.2 12.5 11.9 32.7 11.9 45.2 0l79.4-83v214c0 16.9 14.3 30.6 32 30.6 18 0 32-13.7 32-30.6v-214l79.4 83c12.5 11.9 32.7 11.9 45.2 0s12.5-31.2 0-43.2z"
        style={{
          transformOrigin: "center",
          transform: `rotate(${Math.abs(datum.directionDegrees + 180)}deg)`
        }}
      />
    </svg>
  );
};

function buildGraphDisplayVal(
  fetching: boolean,
  error?: CombinedError,
  curDetail?:
    | {
        y: number;
        x: string;
        directionDegrees: number;
        direction: string;
      }[]
    | null
) {
  let graphDisplayVal = null;
  if (fetching) {
    graphDisplayVal = null;
  } else if (error && !curDetail) {
    graphDisplayVal = (
      <img src={ErrorIcon} style={{ height: 120 }} alt="error" />
    );
  } else if (curDetail && curDetail.length > 0) {
    graphDisplayVal = (
      <MiniGraphWrapper>
        <VictoryChart
          padding={{ left: 50, top: 20, right: 30, bottom: 50 }}
          domainPadding={{ y: [30, 30] }}
          style={{ parent: { touchAction: "auto" } }}
        >
          <VictoryAxis
            fixLabelOverlap={false}
            tickCount={2}
            tickFormat={date => {
              const dayDiff = differenceInCalendarDays(
                new Date(date),
                new Date()
              );
              return dayDiff === 0 ? "now" : `${dayDiff}d`;
            }}
            style={{
              tickLabels: { fontSize: 24 },
              grid: { stroke: "#a0aec0", strokeDasharray: "6, 6" }
            }}
          />
          <VictoryAxis
            scale={{ x: "time" }}
            dependentAxis
            style={{ tickLabels: { fontSize: 24 } }}
          />
          <VictoryGroup data={curDetail}>
            <VictoryLine
              interpolation="natural"
              style={{
                data: { stroke: "#C68E37" },
                parent: { border: "1px solid #ccc" }
              }}
            />
            <VictoryScatter
              dataComponent={<ArrowPoint style={{ fontSize: "2rem" }} />}
            />
          </VictoryGroup>
        </VictoryChart>
      </MiniGraphWrapper>
    );
  }
  return graphDisplayVal;
}

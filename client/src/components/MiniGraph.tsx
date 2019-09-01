import React from "react";
import { VictoryChart, VictoryLine, VictoryAxis } from "victory";
import { differenceInCalendarDays } from "date-fns";
import SkeletonCharacter from "./SkeletonCharacter";
import { CombinedError } from "urql";
import ErrorIcon from "../assets/error.svg";
import MiniGraphWrapper from "./MiniGraphWrapper";

interface Props {
  dependentAxisTickFormat?: (x: any) => any;
  tickValues?: any;
  data?: any;
  fetching: boolean;
  error?: CombinedError;
  className?: string;
}

const MiniGraph: React.FC<Props> = ({
  data,
  dependentAxisTickFormat,
  fetching,
  error,
  tickValues,
  className
}) => {
  let displayVal = null;
  if (fetching) {
    displayVal = <SkeletonCharacter />;
  } else if (error) {
    displayVal = <img src={ErrorIcon} style={{ height: 120 }} alt="error" />;
  } else if (data) {
    displayVal = (
      <VictoryChart
        padding={{ left: 55, top: 20, right: 30, bottom: 50 }}
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
          tickCount={5}
          style={{ tickLabels: { fontSize: 24 } }}
          tickFormat={dependentAxisTickFormat}
          tickValues={tickValues}
        />
        <VictoryLine
          interpolation="natural"
          data={data}
          style={{
            data: { stroke: "#C68E37" },
            parent: { border: "1px solid #ccc" }
          }}
        />
      </VictoryChart>
    );
  }

  return (
    <MiniGraphWrapper className={className}>{displayVal}</MiniGraphWrapper>
  );
};

export default MiniGraph;

import React from "react";
import { VictoryChart, VictoryLine, VictoryAxis } from "victory";
import { differenceInDays } from "date-fns";
import { CombinedError, OperationContext } from "urql";
import ErrorIcon from "../assets/error.svg";
import MiniGraphWrapper from "./MiniGraphWrapper";

interface Props {
  dependentAxisTickFormat?: (x: any) => any;
  tickValues?: any;
  data?: any;
  fetching: boolean;
  error?: CombinedError;
  className?: string;
  refresh?: (opts?: Partial<OperationContext> | undefined) => void;
}

const MiniGraph: React.FC<Props> = ({
  data,
  dependentAxisTickFormat,
  fetching,
  error,
  tickValues,
  className,
  refresh
}) => {
  let displayVal = null;
  if (fetching) {
    displayVal = null;
  } else if (error && !data) {
    displayVal = (
      <div className="flex flex-col">
        <img src={ErrorIcon} style={{ height: 120 }} alt="error" />
        {refresh && (
          <button
            onClick={() => refresh({ requestPolicy: "network-only" })}
            type="button"
            className={"text-black text-sm hover:underline mt-2 mb-1"}
          >
            retry
          </button>
        )}
      </div>
    );
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
            const dayDiff = differenceInDays(new Date(date), new Date());
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

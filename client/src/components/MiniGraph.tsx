import React from "react";
import { VictoryChart, VictoryLine, VictoryAxis } from "victory";
import { differenceInHours, format } from "date-fns";
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
  fullScreen?: boolean;
  tickCount?: number;
}

const MiniGraph: React.FC<Props> = ({
  data,
  dependentAxisTickFormat,
  fetching,
  error,
  tickValues,
  className,
  refresh,
  fullScreen = false,
  tickCount = 2,
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
    // reduce the number of data points to display on the graph
    const mod = Math.ceil(data.length / 72);
    if (mod > 1) {
      data = data.filter((_: any, i: number) => i % mod === 0);
    }

    displayVal = (
      <VictoryChart
        padding={{ left: 55, top: 20, right: 30, bottom: 50 }}
        domainPadding={{ y: [30, 30] }}
        style={{ parent: { touchAction: "auto" } }}
      >
        <VictoryAxis
          fixLabelOverlap={false}
          tickCount={tickCount}
          tickFormat={(date: string) => {
            const dateObj = new Date(date);
            if (fullScreen) {
              return format(dateObj, "ccc") + "\n" + format(dateObj, "ha");
            }

            const hourDiff = Math.abs(differenceInHours(dateObj, new Date()));
            if (hourDiff >= 46) {
              return "-2d";
            } else if (hourDiff >= 18) {
              return "-1d";
            }
            return "now";
          }}
          style={{
            tickLabels: { fontSize: fullScreen ? 8 : 24 },
            grid: {
              stroke: "#a0aec0",
              strokeDasharray: "6, 6",
              strokeWidth: fullScreen ? 0.5 : 1,
            },
          }}
        />
        <VictoryAxis
          scale={{ x: "time" }}
          dependentAxis
          tickCount={5}
          style={{ tickLabels: { fontSize: fullScreen ? 8 : 24 } }}
          tickFormat={dependentAxisTickFormat}
          tickValues={tickValues}
        />
        <VictoryLine
          interpolation="natural"
          data={data}
          style={{
            data: { stroke: "#C68E37", strokeWidth: fullScreen ? 1 : 2 },
            parent: { border: "1px solid #ccc" },
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

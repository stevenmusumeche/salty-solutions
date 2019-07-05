import React from "react";
import { VictoryChart, VictoryLine, VictoryAxis } from "victory";
import { differenceInCalendarDays } from "date-fns";

interface Props {
  data?: any;
  dependentAxisTickFormat?: (x: any) => any;
}

const MiniGraph: React.FC<Props> = ({ data, dependentAxisTickFormat }) => {
  return (
    <div className="bg-white w-full mr-8 rounded-lg shadow-md text-center margin-killer">
      <VictoryChart
        padding={{ left: 50, top: 20, right: 30, bottom: 50 }}
        domainPadding={5}
      >
        <VictoryAxis
          fixLabelOverlap={false}
          tickCount={3}
          tickFormat={date => {
            const dayDiff = differenceInCalendarDays(
              new Date(date),
              new Date()
            );
            return dayDiff === 0 ? "now" : `${dayDiff} days`;
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
        />
        <VictoryLine
          interpolation="natural"
          data={data}
          style={{
            data: { stroke: "#2c5282" },
            parent: { border: "1px solid #ccc" }
          }}
        />
      </VictoryChart>
    </div>
  );
};

export default MiniGraph;

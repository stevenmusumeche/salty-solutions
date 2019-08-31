import React from "react";
import { noDecimals } from "../hooks/utils";
import MiniGraph from "./MiniGraph";
import { useWaterTemperatureData } from "../hooks/useWaterTemperatureData";

interface Props {
  locationId: string;
}

const CurrentWaterTempDetailGraph: React.FC<Props> = ({ locationId }) => {
  const { curDetail: data, fetching, error } = useWaterTemperatureData(
    locationId
  );

  return (
    <MiniGraph
      fetching={fetching}
      error={error}
      data={data}
      dependentAxisTickFormat={noDecimals}
      className="water-temp-graph"
    />
  );
};

export default CurrentWaterTempDetailGraph;

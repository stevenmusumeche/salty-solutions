import React from "react";
import { useTemperatureData } from "../hooks/useTemperatureData";
import { noDecimals } from "../hooks/utils";
import MiniGraph from "./MiniGraph";

interface Props {
  locationId: string;
}

const CurrentAirTempDetailGraph: React.FC<Props> = ({ locationId }) => {
  const { curDetail: data, fetching, error } = useTemperatureData(locationId);

  return (
    <MiniGraph
      fetching={fetching}
      error={error}
      data={data}
      dependentAxisTickFormat={noDecimals}
      className="air-temp-graph"
    />
  );
};

export default CurrentAirTempDetailGraph;

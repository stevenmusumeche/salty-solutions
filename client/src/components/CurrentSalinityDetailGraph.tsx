import React from "react";
import { oneDecimal } from "../hooks/utils";
import MiniGraph from "./MiniGraph";
import { useSalinityData } from "../hooks/useSalinityData";

interface Props {
  locationId: string;
}

const CurrentSalinityDetailGraph: React.FC<Props> = ({ locationId }) => {
  const { curDetail: data, fetching, error } = useSalinityData(locationId);

  return (
    <MiniGraph
      fetching={fetching}
      error={error}
      data={data}
      dependentAxisTickFormat={oneDecimal}
    />
  );
};

export default CurrentSalinityDetailGraph;

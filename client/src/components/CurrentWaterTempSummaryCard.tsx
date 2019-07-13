import React from "react";
import ConditionCard from "./ConditionCard";
import { useTemperatureData } from "../hooks/useTemperatureData";

interface Props {
  locationId: string;
}

const CurrentWaterTempSummaryCard: React.FC<Props> = ({ locationId }) => {
  const { curValue, fetching, error } = useTemperatureData(locationId);

  return (
    <ConditionCard
      label="Water Temperature (F)"
      fetching={fetching}
      error={error}
    >
      {curValue}
    </ConditionCard>
  );
};

export default CurrentWaterTempSummaryCard;

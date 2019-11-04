import React from "react";
import ConditionCard from "./ConditionCard";
import { useWaterTemperatureData } from "../hooks/useWaterTemperatureData";

interface Props {
  locationId: string;
}

const CurrentWaterTempSummaryCard: React.FC<Props> = ({ locationId }) => {
  const { curValue, fetching, error, refresh } = useWaterTemperatureData(
    locationId
  );

  return (
    <ConditionCard
      label="Water Temperature (F)"
      fetching={fetching}
      error={error}
      className="water-temp-summary"
      refresh={refresh}
    >
      {curValue}
    </ConditionCard>
  );
};

export default CurrentWaterTempSummaryCard;

import React from "react";
import ConditionCard from "./ConditionCard";
import { useSalinityData } from "../hooks/useSalinityData";

interface Props {
  locationId: string;
}

const CurrentSalinitySummaryCard: React.FC<Props> = ({ locationId }) => {
  const { curValue, fetching, error } = useSalinityData(locationId);

  return (
    <ConditionCard
      label="Salinity (ppt)"
      className="salinity-summary"
      fetching={fetching}
      error={error}
    >
      {curValue}
    </ConditionCard>
  );
};

export default CurrentSalinitySummaryCard;

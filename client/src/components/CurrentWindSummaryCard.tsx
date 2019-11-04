import React from "react";
import ConditionCard from "./ConditionCard";
import { useCurrentWindData } from "../hooks/useWindData";

interface Props {
  locationId: string;
}
const CurrentWindSummaryCard: React.FC<Props> = ({ locationId }) => {
  const { curValue, curDirectionValue, fetching, error } = useCurrentWindData(
    locationId
  );

  return (
    <ConditionCard
      fetching={fetching}
      error={error}
      label="Wind (mph)"
      className="wind-summary"
    >
      {curValue ? (
        <div>
          {curValue}
          <div className="absolute right-0 top-0 p-2 text-lg md:text-2xl">
            {curDirectionValue}
          </div>
        </div>
      ) : (
        "?"
      )}
    </ConditionCard>
  );
};

export default CurrentWindSummaryCard;

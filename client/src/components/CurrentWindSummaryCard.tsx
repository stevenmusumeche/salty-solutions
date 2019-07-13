import React from "react";
import ConditionCard from "./ConditionCard";
import { useCurrentWindData } from "../hooks/useWindData";

interface Props {
  locationId: string;
}
const CurrentWindSummaryCard: React.FC<Props> = ({ locationId }) => {
  const {
    curValue,
    curDirectionValue,
    fetching: windFetching,
    error: windError
  } = useCurrentWindData(locationId);

  return (
    <ConditionCard fetching={windFetching} error={windError} label="Wind (mph)">
      {curValue ? (
        <div>
          {curValue}
          <div className="absolute right-0 top-0 p-2 text-2xl">
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

import React from "react";
import ConditionCard from "./ConditionCard";
import { useTemperatureData } from "../hooks/useTemperatureData";
import { subHours } from "date-fns";
import MiniGraph from "./MiniGraph";
import { noDecimals } from "../hooks/utils";

interface Props {
  locationId: string;
  date: Date;
}

const CurrentAirTempSummaryCard: React.FC<Props> = ({ locationId, date }) => {
  const { curValue, curDetail, fetching, error } = useTemperatureData(
    locationId,
    subHours(date, 48),
    date
  );

  return (
    <ConditionCard
      label="Air Temperature (F)"
      fetching={fetching}
      error={error}
      className="air-temp-summary"
    >
      <div>
        <div>{curValue}</div>
        <MiniGraph
          fetching={fetching}
          error={error}
          data={curDetail}
          dependentAxisTickFormat={noDecimals}
          className="air-temp-graph"
        />
      </div>
    </ConditionCard>
  );
};

export default CurrentAirTempSummaryCard;

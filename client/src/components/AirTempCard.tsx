import React from "react";
import ConditionCard from "./ConditionCard";
import { hooks } from "@stevenmusumeche/salty-solutions-shared";
import { subHours, startOfDay } from "date-fns";
import MiniGraph from "./MiniGraph";
import { noDecimals } from "../hooks/utils";

interface Props {
  locationId: string;
}

const AirTempCard: React.FC<Props> = ({ locationId }) => {
  const date = startOfDay(new Date());
  const { curValue, curDetail, fetching, error } = hooks.useTemperatureData(
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

export default AirTempCard;

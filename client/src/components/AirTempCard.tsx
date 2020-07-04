import React, { useMemo } from "react";
import ConditionCard from "./ConditionCard";
import { hooks } from "@stevenmusumeche/salty-solutions-shared";
import { subHours } from "date-fns";
import MiniGraph from "./MiniGraph";
import { noDecimals } from "../hooks/utils";
import NoData from "./NoData";

interface Props {
  locationId: string;
}

const AirTempCard: React.FC<Props> = ({ locationId }) => {
  const date = useMemo(() => new Date(), []);

  const { curValue, curDetail, fetching, error } = hooks.useTemperatureData({
    locationId,
    startDate: subHours(date, 48),
    endDate: date,
  });

  return (
    <ConditionCard
      label="Air Temperature (F)"
      fetching={fetching}
      error={error}
      className="air-temp-summary"
    >
      <div className="flex flex-col justify-between h-full w-full">
        {curValue ? (
          <>
            <div>{curValue}</div>
            <MiniGraph
              fetching={fetching}
              error={error}
              data={curDetail}
              dependentAxisTickFormat={noDecimals}
              className="air-temp-graph"
            />
          </>
        ) : (
          <NoData />
        )}
        <div style={{ height: 40 }} />
      </div>
    </ConditionCard>
  );
};

export default AirTempCard;

import React, { useState, useEffect } from "react";
import ConditionCard from "./ConditionCard";
import { useWaterTemperatureData } from "../hooks/useWaterTemperatureData";
import { UsgsSiteDetailFragment } from "../generated/graphql";
import { subHours, startOfDay } from "date-fns";
import UsgsSiteSelect from "./UsgsSiteSelect";
import MiniGraph from "./MiniGraph";
import { noDecimals } from "../hooks/utils";

interface Props {
  locationId: string;
  usgsSites: UsgsSiteDetailFragment[];
}

const WaterTempCard: React.FC<Props> = ({ locationId, usgsSites }) => {
  const [selectedUsgsSiteId, setSelectedUsgsSiteId] = useState(usgsSites[0].id);

  const date = startOfDay(new Date());
  const {
    curValue,
    curDetail,
    fetching,
    error,
    refresh
  } = useWaterTemperatureData(
    locationId,
    selectedUsgsSiteId,
    subHours(date, 48),
    date
  );

  useEffect(() => {
    setSelectedUsgsSiteId(usgsSites[0].id);
  }, [locationId, usgsSites]);

  return (
    <ConditionCard
      label="Water Temperature (F)"
      fetching={fetching}
      error={error}
      className="water-temp-summary"
      refresh={refresh}
    >
      <div>
        <div>{curValue}</div>
        <MiniGraph
          fetching={fetching}
          error={error}
          data={curDetail}
          dependentAxisTickFormat={noDecimals}
          className="water-temp-graph"
          refresh={refresh}
        />
        <UsgsSiteSelect
          sites={usgsSites}
          handleChange={e => setSelectedUsgsSiteId(e.target.value)}
          selectedId={selectedUsgsSiteId}
        />
      </div>
    </ConditionCard>
  );
};

export default WaterTempCard;

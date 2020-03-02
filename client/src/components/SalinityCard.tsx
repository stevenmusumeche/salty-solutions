import React, { useState, useEffect } from "react";
import ConditionCard from "./ConditionCard";
import { useSalinityData } from "../hooks/useSalinityData";
import { UsgsSiteDetailFragment } from "../generated/graphql";
import UsgsSiteSelect from "./UsgsSiteSelect";
import { subHours, startOfDay } from "date-fns/esm";
import { oneDecimal } from "../hooks/utils";
import MiniGraph from "./MiniGraph";

interface Props {
  locationId: string;
  usgsSites: UsgsSiteDetailFragment[];
}

const SalinityCard: React.FC<Props> = ({ locationId, usgsSites }) => {
  const [selectedUsgsSiteId, setSelectedUsgsSiteId] = useState(usgsSites[0].id);

  const date = startOfDay(new Date());
  const { curValue, curDetail, fetching, error } = useSalinityData(
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
      label="Salinity"
      className="salinity-summary"
      fetching={fetching}
      error={error}
    >
      <div>
        <div>{curValue}</div>
        <MiniGraph
          fetching={fetching}
          error={error}
          data={curDetail}
          dependentAxisTickFormat={oneDecimal}
          className="salinity-graph"
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

export default SalinityCard;

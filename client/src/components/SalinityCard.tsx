import React, { useState, useEffect, useMemo } from "react";
import ConditionCard from "./ConditionCard";
import { hooks } from "@stevenmusumeche/salty-solutions-shared";
import UsgsSiteSelect from "./UsgsSiteSelect";
import { subHours } from "date-fns/esm";
import { oneDecimal } from "../hooks/utils";
import MiniGraph from "./MiniGraph";
import { UsgsSiteDetailFragment } from "@stevenmusumeche/salty-solutions-shared/dist/graphql";

interface Props {
  locationId: string;
  sites: UsgsSiteDetailFragment[];
}

const SalinityCard: React.FC<Props> = ({ locationId, sites }) => {
  const [selectedSite, setSelectedSite] = useState(sites[0]);

  const date = useMemo(() => new Date(), []);

  const { curValue, curDetail, fetching, error } = hooks.useSalinityData(
    locationId,
    selectedSite.id,
    subHours(date, 48),
    date
  );

  useEffect(() => {
    setSelectedSite(sites[0]);
  }, [locationId, sites]);

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
        {selectedSite && (
          <UsgsSiteSelect
            sites={sites}
            handleChange={(e) => {
              const match = sites.find((site) => site.id === e.target.value);
              setSelectedSite(match!);
            }}
            selectedId={selectedSite.id}
            fullWidth={true}
          />
        )}
      </div>
    </ConditionCard>
  );
};

export default SalinityCard;

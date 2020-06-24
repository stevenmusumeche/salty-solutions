import React, { useState, useMemo, useEffect } from "react";
import ConditionCard from "./ConditionCard";
import { hooks } from "@stevenmusumeche/salty-solutions-shared";
import { subHours } from "date-fns";
import MiniGraph from "./MiniGraph";
import { noDecimals } from "../hooks/utils";
import { TideStationDetailFragment } from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import UsgsSiteSelect from "./UsgsSiteSelect";
import NoData from "./NoData";

interface Props {
  locationId: string;
  sites: Array<TideStationDetailFragment>;
}

const AirTempCard: React.FC<Props> = ({ locationId, sites }) => {
  const [selectedSite, setSelectedSite] = useState(() =>
    sites.length ? sites[0] : undefined
  );
  const date = useMemo(() => new Date(), []);

  useEffect(() => {
    setSelectedSite(sites.length ? sites[0] : undefined);
  }, [locationId, sites]);

  const { curValue, curDetail, fetching, error } = hooks.useTemperatureData({
    locationId,
    startDate: subHours(date, 48),
    endDate: date,
    noaaStationId:
      selectedSite && selectedSite.__typename === "TidePreditionStation"
        ? selectedSite.id
        : undefined,
  });

  return (
    <ConditionCard
      label="Air Temperature (F)"
      fetching={fetching}
      error={error}
      className="air-temp-summary"
    >
      <div className="flex flex-col justify-between h-full">
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
        {selectedSite ? (
          <UsgsSiteSelect
            sites={sites}
            handleChange={(e) => {
              const match = sites.find((site) => site.id === e.target.value);
              setSelectedSite(match);
            }}
            selectedId={selectedSite.id}
            fullWidth={true}
          />
        ) : (
          <div style={{ height: 40 }} />
        )}
      </div>
    </ConditionCard>
  );
};

export default AirTempCard;

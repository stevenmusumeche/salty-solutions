import React, { useState, useEffect, useMemo } from "react";
import ConditionCard from "./ConditionCard";
import { hooks } from "@stevenmusumeche/salty-solutions-shared";
import { subHours } from "date-fns";
import UsgsSiteSelect from "./UsgsSiteSelect";
import MiniGraph from "./MiniGraph";
import { noDecimals } from "../hooks/utils";
import {
  UsgsSiteDetailFragment,
  TideStationDetailFragment,
} from "@stevenmusumeche/salty-solutions-shared/dist/graphql";

interface Props {
  locationId: string;
  sites: Array<UsgsSiteDetailFragment | TideStationDetailFragment>;
}

const WaterTempCard: React.FC<Props> = ({ locationId, sites }) => {
  const [selectedSite, setSelectedSite] = useState(() =>
    sites.length ? sites[0] : undefined
  );

  const date = useMemo(() => new Date(), []);

  const {
    curValue,
    curDetail,
    fetching,
    error,
    refresh,
  } = hooks.useWaterTemperatureData({
    locationId,
    startDate: subHours(date, 48),
    endDate: date,
    usgsSiteId:
      selectedSite && selectedSite.__typename === "UsgsSite"
        ? selectedSite.id
        : undefined,
    noaaStationId:
      selectedSite && selectedSite.__typename === "TidePreditionStation"
        ? selectedSite.id
        : undefined,
  });

  useEffect(() => {
    setSelectedSite(sites.length ? sites[0] : undefined);
  }, [locationId, sites]);

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
        {selectedSite && (
          <UsgsSiteSelect
            sites={sites}
            handleChange={(e) => {
              const match = sites.find((site) => site.id === e.target.value);
              setSelectedSite(match);
            }}
            selectedId={selectedSite.id}
            fullWidth={true}
          />
        )}
      </div>
    </ConditionCard>
  );
};

export default WaterTempCard;

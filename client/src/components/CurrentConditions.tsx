import { LocationDetailFragment } from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import {
  useSalinitySites,
  useWaterTempSites,
  useWindSites,
} from "@stevenmusumeche/salty-solutions-shared/dist/hooks";
import React from "react";
import AirTempCard from "./AirTempCard";
import SalinityCard from "./SalinityCard";
import WaterTempCard from "./WaterTempCard";
import WindCard from "./WindCard";

interface Props {
  location: LocationDetailFragment;
}

const CurrentConditions: React.FC<Props> = ({ location }) => {
  const windSites = useWindSites(location);
  const salinitySites = useSalinitySites(location);
  const waterTempSites = useWaterTempSites(location);

  return (
    <>
      <span id="current-conditions"></span>
      <div className="current-conditions-grid">
        <WindCard locationId={location.id} sites={windSites} />
        <AirTempCard locationId={location.id} />
        <WaterTempCard locationId={location.id} sites={waterTempSites} />
        <SalinityCard locationId={location.id} sites={salinitySites} />
      </div>
    </>
  );
};

export default CurrentConditions;

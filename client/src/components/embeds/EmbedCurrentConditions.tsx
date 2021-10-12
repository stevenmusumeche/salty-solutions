import { RouteComponentProps } from "@reach/router";
import {
  useSalinitySites,
  useWaterTempSites,
  useWindSites,
} from "@stevenmusumeche/salty-solutions-shared/dist/hooks";
import React from "react";
// import Logo from "../../assets/logos/logo-white-bg.svg";
import Logo from "../../assets/logos/logo.svg";
import { useEmbedLocation } from "../../hooks/useEmbedLocation";
import { useRemoveLoader } from "../../hooks/useRemoveLoader";
import AirTempCard from "../AirTempCard";
import SalinityCard from "../SalinityCard";
import WaterTempCard from "../WaterTempCard";
import WindCard from "../WindCard";
import EmbedWrapper from "./EmbedWrapper";

const EmbedCurrentConditions: React.FC<RouteComponentProps> = () => {
  useRemoveLoader();
  const { location, loading, locationId } = useEmbedLocation();
  const windSites = useWindSites(location);
  const salinitySites = useSalinitySites(location);
  const waterTempSites = useWaterTempSites(location);

  if (loading) return null;
  if (!location) return <div>Unable to load {locationId}</div>;

  return (
    <EmbedWrapper>
      <div className="md:flex items-center justify-between bg-gray-700 text-gray-200 p-2">
        <div>
          <div className="text-xl">Current Conditions for {location.name}</div>
          <div className="text-sm">
            Provided by{" "}
            <a
              href={`https://salty.solutions/${locationId}`}
              target="_blank"
              rel="noreferrer"
              className="text-brand-yellow hover:underline"
            >
              Salty Solutions
            </a>
          </div>
        </div>
        <div className="hidden md:block">
          <a
            href={`https://salty.solutions/${locationId}`}
            target="_blank"
            rel="noreferrer"
          >
            <img src={Logo} className="w-32" alt="Salty Solutions Logo" />
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <WindCard locationId={location.id} sites={windSites} />
        <AirTempCard locationId={location.id} />
        <WaterTempCard locationId={location.id} sites={waterTempSites} />
        <SalinityCard locationId={location.id} sites={salinitySites} />
      </div>
    </EmbedWrapper>
  );
};

export default EmbedCurrentConditions;

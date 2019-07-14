import React, { useState, ChangeEventHandler } from "react";
import CurrentWindSummaryCard from "./components/CurrentWindSummaryCard";
import CurrentWindDetailGraph from "./components/CurrentWindDetailGraph";
import CurrentAirTempSummaryCard from "./components/CurrentAirTempSummaryCard";
import CurrentAirTempDetailGraph from "./components/CurrentAirTempDetailGraph";
import CurrentSalinitySummaryCard from "./components/CurrentSalinitySummaryCard";
import CurrentSalinityDetailGraph from "./components/CurrentSalinityDetailGraph";
import CurrentWaterTempSummaryCard from "./components/CurrentWaterTempSummaryCard";
import CurrentWaterTempDetailGraph from "./components/CurrentWaterTempDetailGraph";
import { useLocationsQuery, LocationsQuery } from "./generated/graphql";
import { UseQueryState } from "urql";
import Forecast from "./components/Forecast";
import "./App.css";

const App: React.FC = () => {
  const [locations] = useLocationsQuery();
  const [locationId, setLocationId] = useState("2");

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocationId(e.target.value);
  };

  return (
    <div className="container mx-auto py-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <LocationSelect
          locations={locations}
          onChange={handleLocationChange}
          value={locationId}
        />
        <div>date selector</div>
      </div>
      <h2 className="text-4xl mb-8">Current Conditions</h2>
      <div className="current-conditions-grid mb-8">
        <CurrentWindSummaryCard locationId={locationId} />
        <CurrentSalinitySummaryCard locationId={locationId} />
        <CurrentAirTempSummaryCard locationId={locationId} />
        <CurrentWaterTempSummaryCard locationId={locationId} />
        <CurrentWindDetailGraph locationId={locationId} />
        <CurrentSalinityDetailGraph locationId={locationId} />
        <CurrentAirTempDetailGraph locationId={locationId} />
        <CurrentWaterTempDetailGraph locationId={locationId} />
      </div>
      <h2 className="text-4xl mb-8">Forecast</h2>
      <Forecast locationId={locationId} />
    </div>
  );
};

export default App;

interface LocationSelectProps {
  locations: UseQueryState<LocationsQuery>;
  value: string;
  onChange: ChangeEventHandler;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
  locations,
  value,
  onChange
}) => (
  <select onChange={onChange} className="text-3xl" value={value}>
    {locations.data &&
      locations.data.locations
        .sort((a, b) => ("" + a.name).localeCompare(b.name))
        .map(location => {
          return (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          );
        })}
  </select>
);

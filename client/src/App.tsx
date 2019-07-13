import React, { useState } from "react";
import ConditionCard from "./components/ConditionCard";
import MiniGraph from "./components/MiniGraph";
import { useCurrentWaterTemperatureQuery } from "./generated/graphql";
import CurrentWindSummaryCard from "./components/CurrentWindSummaryCard";
import CurrentWindDetailGraph from "./components/CurrentWindDetailGraph";
import CurrentAirTempSummaryCard from "./components/CurrentAirTempSummaryCard";
import CurrentAirTempDetailGraph from "./components/CurrentAirTempDetailGraph";
import CurrentSalinitySummaryCard from "./components/CurrentSalinitySummaryCard";
import CurrentSalinityDetailGraph from "./components/CurrentSalinityDetailGraph";
import CurrentWaterTempSummaryCard from "./components/CurrentWaterTempSummaryCard";
import CurrentWaterTempDetailGraph from "./components/CurrentWaterTempDetailGraph";

const App: React.FC = () => {
  const [locationId, setLocationId] = useState("1");

  const [waterTempResult] = useCurrentWaterTemperatureQuery();

  return (
    <div className="container mx-auto py-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Calcasieu Lake</h1>
        <div>date selector</div>
      </div>
      <div className="flex justify-between mb-8" />
      <div className="current-conditions-grid">
        <CurrentWindSummaryCard locationId={locationId} />
        <CurrentSalinitySummaryCard locationId={locationId} />
        <CurrentAirTempSummaryCard locationId={locationId} />
        <CurrentWaterTempSummaryCard locationId={locationId} />
        <CurrentWindDetailGraph locationId={locationId} />
        <CurrentSalinityDetailGraph locationId={locationId} />
        <CurrentAirTempDetailGraph locationId={locationId} />
        <CurrentWaterTempDetailGraph locationId={locationId} />
      </div>
    </div>
  );
};

export default App;

function noDecimals(x: any) {
  return x.toFixed(0);
}

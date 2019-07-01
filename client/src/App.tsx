import React from "react";
import ConditionCard from "./components/ConditionCard";

const App: React.FC = () => {
  return (
    <div className="container mx-auto py-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Calcasieu Lake</h1>
        <div>date selector</div>
      </div>
      <div className="flex justify-between">
        <ConditionCard value="12SE" label="Wind" />
        <ConditionCard value="14" label="Salinity" />
        <ConditionCard value="87°" label="Air Temperature" />
        <ConditionCard value="81°" label="Water Temperature" />
      </div>
    </div>
  );
};

export default App;

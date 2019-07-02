import React from "react";
import ConditionCard from "./components/ConditionCard";
import { useQuery } from "urql";
import WIND_QUERY from "./queries/wind-query";
import TEMPERATURE_QUERY from "./queries/temperature-query";
import WATER_TEMPERATURE_QUERY from "./queries/water-temperature-query";

const App: React.FC = () => {
  const [windResult] = useQuery({
    query: WIND_QUERY
  });

  const [tempResult] = useQuery({
    query: TEMPERATURE_QUERY
  });

  const [waterTempResult] = useQuery({
    query: WATER_TEMPERATURE_QUERY
  });

  return (
    <div className="container mx-auto py-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Calcasieu Lake</h1>
        <div>date selector</div>
      </div>
      <div className="flex justify-between">
        <ConditionCard
          fetching={windResult.fetching}
          error={windResult.error}
          value={
            windResult.data &&
            windResult.data.location.wind.summary.mostRecent.speed
          }
          label="Wind Speed"
        />
        <ConditionCard
          fetching={windResult.fetching}
          error={windResult.error}
          value={
            windResult.data &&
            windResult.data.location.wind.summary.mostRecent.direction
          }
          label="Wind Direction"
        />
        {/* <ConditionCard value="14" label="Salinity" /> */}
        <ConditionCard
          label="Air Temperature"
          fetching={tempResult.fetching}
          error={tempResult.error}
          value={
            tempResult.data &&
            `${tempResult.data.location.temperature.summary.mostRecent}°`
          }
        />
        <ConditionCard
          label="Water Temperature"
          fetching={waterTempResult.fetching}
          error={waterTempResult.error}
          value={
            waterTempResult.data &&
            `${
              waterTempResult.data.location.waterTemperature.summary.mostRecent
                .temperature
            }°`
          }
        />
      </div>
    </div>
  );
};

export default App;

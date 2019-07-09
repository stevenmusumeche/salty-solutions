import React from "react";
import ConditionCard from "./components/ConditionCard";
import { useQuery } from "urql";
import WIND_QUERY from "./queries/wind-query";
import TEMPERATURE_QUERY from "./queries/temperature-query";
import WATER_TEMPERATURE_QUERY from "./queries/water-temperature-query";
import MiniGraph from "./components/MiniGraph";
import SALINITY_QUERY from "./queries/salinity-query";

// import {
//   salinityResult,
//   tempResult,
//   waterTempResult,
//   windResult
// } from "./mock-data";

import MiniWindGraph from "./components/MiniWindGraph";

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

  const [salinityResult] = useQuery({
    query: SALINITY_QUERY
  });

  return (
    <div className="container mx-auto py-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Calcasieu Lake</h1>
        <div>date selector</div>
      </div>
      <div className="flex justify-between mb-8">
        <ConditionCard
          fetching={windResult.fetching}
          error={windResult.error}
          value={
            windResult.data && windResult.data.location.wind.summary.mostRecent
              ? windResult.data.location.wind.summary.mostRecent.speed +
                "" +
                windResult.data.location.wind.summary.mostRecent.direction
              : "?"
          }
          label="Wind (mph)"
        />
        <ConditionCard
          label="Salinity (ppt)"
          fetching={salinityResult.fetching}
          error={salinityResult.error}
          value={
            salinityResult.data &&
            salinityResult.data.location.salinitySummary.summary
              ? salinityResult.data.location.salinitySummary.summary
                  .averageValue
              : "?"
          }
        />
        <ConditionCard
          label="Air Temperature (F)"
          fetching={tempResult.fetching}
          error={tempResult.error}
          value={
            tempResult.data &&
            `${Math.round(
              tempResult.data.location.temperature.summary.mostRecent
            )}°`
          }
        />
        <ConditionCard
          label="Water Temperature (F)"
          fetching={waterTempResult.fetching}
          error={waterTempResult.error}
          value={
            waterTempResult.data &&
            `${Math.round(
              waterTempResult.data.location.waterTemperature.summary.mostRecent
                .temperature
            )}°`
          }
        />
      </div>
      <div className="flex justify-between">
        <MiniWindGraph
          fetching={windResult.fetching}
          error={windResult.error}
          data={
            windResult.data &&
            windResult.data.location.wind.detail.map((data: any) => ({
              y: data.speed,
              x: data.timestamp,
              directionDegrees: data.directionDegrees,
              direction: data.direction
            }))
          }
        />

        <MiniGraph
          fetching={salinityResult.fetching}
          error={salinityResult.error}
          data={
            salinityResult.data &&
            salinityResult.data.location.salinityDetail.detail.map(
              (data: any) => ({
                y: data.salinity,
                x: data.timestamp
              })
            )
          }
        />
        <MiniGraph
          fetching={salinityResult.fetching}
          error={salinityResult.error}
          data={
            tempResult.data &&
            tempResult.data.location.temperature.detail.map((data: any) => ({
              y: data.temperature,
              x: data.timestamp
            }))
          }
          dependentAxisTickFormat={noDecimals}
        />
        <MiniGraph
          fetching={waterTempResult.fetching}
          error={waterTempResult.error}
          data={
            waterTempResult.data &&
            waterTempResult.data.location.waterTemperature.detail.map(
              (data: any) => ({
                y: data.temperature,
                x: data.timestamp
              })
            )
          }
          dependentAxisTickFormat={noDecimals}
        />
      </div>
    </div>
  );
};

export default App;

function noDecimals(x: any) {
  return x.toFixed(0);
}

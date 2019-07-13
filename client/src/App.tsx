import React from "react";
import ConditionCard from "./components/ConditionCard";
import MiniGraph from "./components/MiniGraph";

// import {
//   salinityResult,
//   tempResult,
//   waterTempResult,
//   windResult
// } from "./mock-data";

import MiniWindGraph from "./components/MiniWindGraph";
import {
  useWindDataQuery,
  useCurrentTemperatureQuery,
  useCurrentWaterTemperatureQuery,
  useSalinityQuery
} from "./generated/graphql";

const App: React.FC = () => {
  const [windResult] = useWindDataQuery();
  const [tempResult] = useCurrentTemperatureQuery();
  const [waterTempResult] = useCurrentWaterTemperatureQuery();
  const [salinityResult] = useSalinityQuery();

  return (
    <div className="container mx-auto py-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Calcasieu Lake</h1>
        <div>date selector</div>
      </div>
      <div className="flex justify-between mb-8" />
      <div className="current-conditions-grid">
        <ConditionCard
          fetching={windResult.fetching}
          error={windResult.error}
          label="Wind (mph)"
        >
          {windResult.data &&
          windResult.data.location &&
          windResult.data.location.wind.summary.mostRecent ? (
            <div>
              {noDecimals(
                windResult.data.location.wind.summary.mostRecent.speed
              )}
              <div className="absolute right-0 top-0 p-2 text-2xl">
                {windResult.data.location.wind.summary.mostRecent.direction}
              </div>
            </div>
          ) : (
            "?"
          )}
        </ConditionCard>
        <ConditionCard
          label="Salinity (ppt)"
          fetching={salinityResult.fetching}
          error={salinityResult.error}
        >
          {salinityResult.data &&
          salinityResult.data.location &&
          salinityResult.data.location.salinitySummary.summary
            ? noDecimals(
                salinityResult.data.location.salinitySummary.summary
                  .averageValue
              )
            : "?"}
        </ConditionCard>
        <ConditionCard
          label="Air Temperature (F)"
          fetching={tempResult.fetching}
          error={tempResult.error}
        >
          {tempResult.data &&
            tempResult.data.location &&
            `${Math.round(
              tempResult.data.location.temperature.summary.mostRecent
            )}°`}
        </ConditionCard>
        <ConditionCard
          label="Water Temperature (F)"
          fetching={waterTempResult.fetching}
          error={waterTempResult.error}
        >
          {waterTempResult.data &&
            waterTempResult.data.location &&
            waterTempResult.data.location.waterTemperature &&
            waterTempResult.data.location.waterTemperature.summary &&
            waterTempResult.data.location.waterTemperature.summary.mostRecent &&
            `${Math.round(
              waterTempResult.data.location.waterTemperature.summary.mostRecent
                .temperature
            )}°`}
        </ConditionCard>
        <MiniWindGraph
          fetching={windResult.fetching}
          error={windResult.error}
          data={
            windResult.data &&
            windResult.data.location &&
            windResult.data.location.wind &&
            windResult.data.location.wind.detail &&
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
            salinityResult.data.detail &&
            salinityResult.data.detail.salinityDetail &&
            salinityResult.data.detail.salinityDetail.detail &&
            salinityResult.data.detail.salinityDetail.detail.map(
              (data: any) => ({
                y: data.salinity,
                x: data.timestamp
              })
            )
          }
          dependentAxisTickFormat={noDecimals}
        />
        <MiniGraph
          fetching={salinityResult.fetching}
          error={salinityResult.error}
          data={
            tempResult.data &&
            tempResult.data.location &&
            tempResult.data.location.temperature &&
            tempResult.data.location.temperature.detail &&
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
            waterTempResult.data.location &&
            waterTempResult.data.location.waterTemperature &&
            waterTempResult.data.location.waterTemperature.detail &&
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

function oneDecimal(x: any) {
  return x.toFixed(1);
}

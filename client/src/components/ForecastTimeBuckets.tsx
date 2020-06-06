import React, { FC } from "react";
import {
  prepareForecastData,
  degreesToCompass,
} from "@stevenmusumeche/salty-solutions-shared/dist/forecast-helpers";
import { CombinedForecastV2DetailFragment } from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import WaveIcon from "./WaveIcon";

interface Props {
  data: CombinedForecastV2DetailFragment;
  date: Date;
}

const ForecastTimeBuckets: FC<Props> = ({ data, date }) => {
  const { timeChunks } = prepareForecastData(data, date);

  return (
    <div className="flex mt-4 justify-between items-start text-center flex-grow p-4 bg-gray-100 border-gray-200 border border-l-0 border-r-0 text-xs">
      {timeChunks.map((timeChunk, i) => {
        return (
          <div className="mr-2 last:mr-0" key={i}>
            <div className="uppercase text-gray-600 tracking-wide">
              {timeChunk.label}
            </div>
            <div className="mt-0 mb-1">
              <WaveIcon min={timeChunk.min} max={timeChunk.max} />
            </div>
            {timeChunk.min === Infinity ? (
              <div className="mb-1">unknown</div>
            ) : (
              <div className="mb-1">
                <WindRange min={timeChunk.min} max={timeChunk.max} />{" "}
                {degreesToCompass(timeChunk.averageDirection)}
              </div>
            )}
            {timeChunk.averageTemperature && (
              <div className="text-xl leading-none">
                {timeChunk.averageTemperature.toFixed(0)}°
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ForecastTimeBuckets;

const WindRange: FC<{ min: number; max: number }> = ({ min, max }) => {
  const roundedMin = Math.ceil(min);
  const roundedMax = Math.ceil(max);
  const isSame = roundedMin === roundedMax;
  return <>{isSame ? roundedMin : `${roundedMin}-${roundedMax}`}</>;
};

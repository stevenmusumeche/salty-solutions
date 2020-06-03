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
    <div className="flex mt-6 mb-6 text-xs justify-between items-start text-center flex-grow">
      {timeChunks.map((timeChunk, i) => {
        return (
          <div className="mr-2 last:mr-0" key={i}>
            <div className="uppercase text-gray-600 tracking-wide">
              {timeChunk.label}
            </div>
            <div className="mt-2 mb-1">
              <WaveIcon min={timeChunk.min} max={timeChunk.max} />
            </div>
            {timeChunk.min === Infinity ? (
              <div className="mb-1">unknown</div>
            ) : (
              <div className="mb-1">
                {Math.ceil(timeChunk.min)}-{Math.ceil(timeChunk.max)}{" "}
                {degreesToCompass(timeChunk.averageDirection)}
              </div>
            )}
            {timeChunk.averageTemperature && (
              <div className="text-xl">
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

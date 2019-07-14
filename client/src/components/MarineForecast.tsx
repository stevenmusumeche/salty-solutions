import React, { ReactNode } from "react";
import { useForecastQuery } from "../generated/graphql";
import ErrorIcon from "../assets/error.svg";
import ForecastSkeleton from "./ForecastSkeleton";

interface Props {
  locationId: string;
}

const MarineForecast: React.FC<Props> = ({ locationId }) => {
  const [forecast] = useForecastQuery({ variables: { locationId } });

  if (forecast.fetching) {
    return (
      <Wrapper>
        <ForecastSkeleton />
      </Wrapper>
    );
  } else if (forecast.error) {
    return (
      <Wrapper>
        <img
          src={ErrorIcon}
          style={{ height: 120 }}
          className="my-8 mx-auto"
          alt="error"
        />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {forecast.data &&
        forecast.data.location &&
        forecast.data.location.marineForecast &&
        forecast.data.location.marineForecast.map(data => {
          return (
            <div className="mb-4 last-no-margin" key={data.timePeriod}>
              <div className="uppercase tracking-wider text-gray-600">
                {data.timePeriod}
              </div>
              <div>{data.forecast}</div>
            </div>
          );
        })}
    </Wrapper>
  );
};

export default MarineForecast;

const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="relative bg-white rounded-lg shadow-md p-4">
    <h2 className="text-2xl font-medium mb-2">Marine Forecast</h2>
    {children}
  </div>
);

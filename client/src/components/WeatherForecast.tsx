import React, { ReactNode } from "react";
import { useForecastQuery } from "../generated/graphql";
import ErrorIcon from "../assets/error.svg";
import ForecastSkeleton from "./ForecastSkeleton";

interface Props {
  locationId: string;
}

const WeatherForecast: React.FC<Props> = ({ locationId }) => {
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

  const data =
    forecast.data &&
    forecast.data.location &&
    forecast.data.location.weatherForecast &&
    forecast.data.location.weatherForecast.slice(0, 8);

  return (
    <Wrapper>
      {data &&
        data.map(data => {
          return (
            <div key={data.name} className="mb-4 last-no-margin">
              <div className="uppercase tracking-wider text-gray-600">
                {data.name}
              </div>
              <div>{data.detailedForecast}</div>
            </div>
          );
        })}
    </Wrapper>
  );
};

export default WeatherForecast;

const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="relative bg-white rounded-lg shadow-md p-4">
    <h2 className="text-2xl font-medium mb-2">Weather Forecast</h2>
    {children}
  </div>
);

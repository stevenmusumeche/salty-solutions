import React, { ReactNode } from "react";
import { useForecastQuery } from "../generated/graphql";
import "./WeatherForecast.css";
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

  return (
    <Wrapper>
      {forecast.data &&
        forecast.data.location &&
        forecast.data.location.weatherForecast &&
        forecast.data.location.weatherForecast.slice(0, 7).map(data => {
          return (
            <>
              <div className="uppercase tracking-wider text-gray-600">
                {data.name}
              </div>
              <div className="forecast-entry mb-4 last-no-margin">
                <div>
                  <div>{data.detailedForecast}</div>
                </div>
                <div className="text-center">
                  <img src={data.icon} className="" />
                  <div>
                    {data.temperature}°{data.temperatureUnit}
                  </div>
                </div>
              </div>
            </>
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

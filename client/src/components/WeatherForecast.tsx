import React, { ReactNode } from "react";
import { useForecastQuery } from "../generated/graphql";
import ErrorIcon from "../assets/error.svg";
import ForecastSkeleton from "./ForecastSkeleton";
import { ForecastType } from "./Forecast";

interface Props {
  locationId: string;
  setForecastType: (type: ForecastType) => void;
}

const WeatherForecast: React.FC<Props> = ({ locationId, setForecastType }) => {
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
    forecast.data.location.weatherForecast;

  return (
    <Wrapper setForecastType={setForecastType}>
      {data &&
        data.map(data => {
          return (
            <div key={data.name} className="mb-8 last-no-margin">
              <div className="clearfix">
                <div className="float-right">
                  <img
                    src={data.icon}
                    alt={data.shortForecast}
                    className="rounded-image h-20 ml-2 mb-2"
                  />
                </div>
                <div className="min-w-0">
                  <div className="forecast-header">{data.name}</div>
                  <div className="">
                    {data.shortForecast}, {data.temperature}°
                    {data.temperatureUnit}
                    {data.windSpeed && (
                      <>
                        , {data.windSpeed} {data.windDirection}
                      </>
                    )}
                  </div>
                  <div className="text-xs mt-1 relative">
                    {data.detailedForecast}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </Wrapper>
  );
};

export default WeatherForecast;

const Wrapper: React.FC<{
  children: ReactNode;
  setForecastType?: (e: any) => void;
}> = ({ children, setForecastType }) => (
  <div
    className="forecast-wrapper scroller-vertical"
    style={{ maxHeight: 1000 }}
  >
    <div className="flex justify-between items-start">
      <h2 className="forecast-title">Weather Forecast</h2>
      {setForecastType && (
        <button
          className="block text-gray-700 text-sm"
          onClick={() => setForecastType(ForecastType.Hourly)}
        >
          View Hourly
        </button>
      )}
    </div>
    {children}
  </div>
);

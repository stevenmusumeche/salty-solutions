import React, { ReactNode } from "react";
import { useForecastQuery } from "../generated/graphql";
import "./ForecastSummary.css";
import ErrorIcon from "../assets/error.svg";

const NUM_ENTRIES = 7;

interface Props {
  locationId: string;
}
const ForecastSummary: React.FC<Props> = ({ locationId }) => {
  const [forecast] = useForecastQuery({ variables: { locationId } });

  if (forecast.fetching) {
    return (
      <Wrapper>
        {[...Array(NUM_ENTRIES)].map((x, i) => (
          <Entry key={i}>
            <SkeletonEntry />
          </Entry>
        ))}
      </Wrapper>
    );
  } else if (forecast.error) {
    return (
      <Wrapper>
        {[...Array(NUM_ENTRIES)].map((x, i) => (
          <Entry key={i}>
            <img
              src={ErrorIcon}
              alt="error"
              style={{ height: 120 }}
              className="my-8 mx-auto"
            />
          </Entry>
        ))}
      </Wrapper>
    );
  }

  const data =
    forecast.data &&
    forecast.data.location &&
    forecast.data.location.weatherForecast &&
    forecast.data.location.weatherForecast.slice(0, NUM_ENTRIES);

  return (
    <Wrapper>
      {data &&
        data.map(datum => {
          return (
            <Entry key={datum.name}>
              <img
                src={datum.icon}
                alt="forecast icon"
                className="mx-auto border-gray-300 border rounded mb-2"
              />
              <div className="text-center font-medium text-xl mb-2">
                {datum.name}
              </div>
              <div className="text-center text-lg leading-tight mb-2 text-gray-700">
                {datum.temperature}°{datum.temperatureUnit}
                <br />
                {datum.windSpeed ? (
                  <>
                    {datum.windSpeed} ({datum.windDirection})
                  </>
                ) : (
                  <>&nbsp;</>
                )}
              </div>
              <div className="text-gray-500 text-sm leading-tight">
                {datum.shortForecast}
              </div>
            </Entry>
          );
        })}
    </Wrapper>
  );
};

export default ForecastSummary;

const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="short-forecast-grid mb-8">{children}</div>
);

const Entry: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="relative bg-white rounded-lg shadow-md py-4 px-2">
    {children}
  </div>
);

const SkeletonEntry: React.FC = () => {
  return (
    <div className="m-auto">
      <div
        className="skeleton-character mx-auto mb-4"
        style={{ width: 100, height: 100 }}
      />
      <div className="skeleton-character  mx-auto " style={{ width: "75%" }} />
      <div
        className="skeleton-character  mx-auto mb-4"
        style={{ width: "55%" }}
      />
      <div className="skeleton-character" style={{ width: "97%" }} />
      <div className="skeleton-character" style={{ width: "90%" }} />
    </div>
  );
};

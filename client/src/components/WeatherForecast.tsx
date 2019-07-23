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
    forecast.data.location.weatherForecast &&
    forecast.data.location.weatherForecast.slice(0, 10);

  return (
    <Wrapper setForecastType={setForecastType}>
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

const Wrapper: React.FC<{
  children: ReactNode;
  setForecastType?: (e: any) => void;
}> = ({ children, setForecastType }) => (
  <div className="relative bg-white rounded-lg shadow-md p-4 flex-shrink-0 flex-grow-0">
    <div className="flex justify-between items-start">
      <h2 className="text-2xl font-medium mb-2">Weather Forecast</h2>
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

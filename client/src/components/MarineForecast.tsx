import React, { ReactNode } from "react";
import { useForecastQuery } from "../generated/graphql";
import ErrorIcon from "../assets/error.svg";
import ForecastSkeleton from "./ForecastSkeleton";

interface Props {
  locationId: string;
}

// todo: can we parse the marine forecast text to extract info, like
// wind: SW 5-10 from, light chop
// Southwest winds 5 to 10 knots. Lake waters a light chop. Chance of showers and thunderstorms late in the morning, then showers and thunderstorms in the afternoon."

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
              <div className="forecast-header">{data.timePeriod}</div>
              <div>{data.forecast.text}</div>
            </div>
          );
        })}
    </Wrapper>
  );
};

export default MarineForecast;

const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="forecast-wrapper scroller-vertical">
    <h2 className="forecast-title">Marine Forecast</h2>
    {children}
  </div>
);

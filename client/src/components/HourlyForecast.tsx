import React, { ReactNode } from "react";
import {
  useHourlyForecastQuery,
  HourlyForecastDetailFragment
} from "../generated/graphql";
import ErrorIcon from "../assets/error.svg";
import ForecastSkeleton from "./ForecastSkeleton";
import { ForecastType } from "./Forecast";
import { format } from "date-fns";

interface Props {
  locationId: string;
  setForecastType: (type: ForecastType) => void;
}

const HourlyForecast: React.FC<Props> = ({ locationId, setForecastType }) => {
  const [forecast] = useHourlyForecastQuery({ variables: { locationId } });

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
    (forecast.data &&
      forecast.data.location &&
      forecast.data.location.hourlyWeatherForecast) ||
    [];

  // group into days (local time)
  const grouped = data.reduce(
    (acc, cur) => {
      const localDay = format(
        new Date(cur.startTime),
        "yyyy-MM-dd'T'00:00:00.000xxx"
      );
      if (!acc[localDay]) acc[localDay] = [];
      acc[localDay].push(cur);
      return acc;
    },
    {} as { [date: string]: HourlyForecastDetailFragment[] }
  );

  const days = Object.keys(grouped).sort();

  return (
    <Wrapper setForecastType={setForecastType}>
      {days.map(day => {
        return (
          <div key={day} className="mb-8">
            <div className="forecast-header mb-4">
              {format(new Date(day), "cccc")}
            </div>
            {grouped[day].map(hour => {
              return <Hour key={`${day}${hour.startTime}`} hour={hour} />;
            })}
          </div>
        );
      })}
    </Wrapper>
  );
};

const Hour: React.FC<{ hour: HourlyForecastDetailFragment }> = ({ hour }) => {
  return (
    <div className="hourly-row">
      <div className="text-right">
        {format(new Date(hour.startTime), "h:mma").toLowerCase()}
      </div>
      <div>
        <img
          src={hour.icon}
          alt={hour.shortForecast}
          className="rounded-image w-100 mx-auto"
        />
      </div>
      <div>
        {hour.temperature}°{hour.temperatureUnit}
      </div>
      <div>
        {hour.windSpeed ? `${hour.windSpeed} ${hour.windDirection}` : null}
      </div>
      <div className="text-left">{hour.shortForecast}</div>
    </div>
  );
};

export default HourlyForecast;

const Wrapper: React.FC<{
  children: ReactNode;
  setForecastType?: (e: any) => void;
}> = ({ children, setForecastType }) => (
  <div className="forecast-wrapper scroller-vertical">
    <div className="flex justify-between items-start">
      <h2 className="forecast-title">Hourly Forecast</h2>
      {setForecastType && (
        <button
          className="block text-gray-700 text-sm"
          onClick={() => setForecastType(ForecastType.Weather)}
        >
          View Daily
        </button>
      )}
    </div>
    {children}
  </div>
);

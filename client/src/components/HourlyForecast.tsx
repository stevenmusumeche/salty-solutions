import React, { ReactNode, useContext } from "react";
import {
  HourlyForecastDetailFragment,
  useCombinedForecastQuery
} from "../generated/graphql";
import ErrorIcon from "../assets/error.svg";
import ForecastSkeleton from "./ForecastSkeleton";
import { format } from "date-fns";
import { WindowSizeContext } from "../providers/WindowSizeProvider";

interface Props {
  locationId: string;
}

const HourlyForecast: React.FC<Props> = ({ locationId }) => {
  const [forecast] = useCombinedForecastQuery({ variables: { locationId } });
  const { isSmall } = useContext(WindowSizeContext);

  const data =
    (forecast.data &&
      forecast.data.location &&
      forecast.data.location.hourlyWeatherForecast) ||
    [];

  if (forecast.fetching) {
    return (
      <Wrapper>
        <ForecastSkeleton />
      </Wrapper>
    );
  } else if (forecast.error && data.length === 0) {
    return (
      <Wrapper isError={true}>
        <img
          src={ErrorIcon}
          style={{ height: 120 }}
          className="my-8 mx-auto"
          alt="error"
        />
      </Wrapper>
    );
  }

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

  const days = Object.keys(grouped)
    .sort()
    .splice(0, 6);

  return (
    <Wrapper>
      {days.map(day => {
        const numHours = grouped[day].length;
        if (numHours < 24 && !isSmall) {
          // @ts-ignore
          grouped[day] = [
            ...Array.from({ length: 24 - numHours }, (v, i) => null),
            ...grouped[day]
          ];
        }

        return (
          <div
            key={day}
            className={`${isSmall && "forecast-wrapper"} mb-4 md:mb-8`}
          >
            <div className="forecast-header mb-4">
              {format(new Date(day), "cccc")}
            </div>
            {grouped[day].map((hour, i) => {
              if (hour === null) {
                return (
                  <div className="hourly-row" key={i}>
                    &nbsp;
                  </div>
                );
              }
              return <Hour key={`${day}${hour.startTime}`} hour={hour} />;
            })}
          </div>
        );
      })}
    </Wrapper>
  );
};

const Hour: React.FC<{ hour: HourlyForecastDetailFragment }> = ({ hour }) => {
  const { isSmall } = useContext(WindowSizeContext);
  let windDisplay;
  if (hour.windSpeed && hour.windDirection) {
    if (hour.windSpeed.from === hour.windSpeed.to) {
      windDisplay = `${hour.windSpeed.to} ${hour.windDirection.text}`;
    } else {
      windDisplay = `${hour.windSpeed.from}-${hour.windSpeed.to} ${hour.windDirection.text}`;
    }
  }
  return (
    <div className="hourly-row">
      <div
        className="text-right"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {format(new Date(hour.startTime), "ha").toLowerCase()}
      </div>
      {!isSmall && (
        <div>
          <img
            src={hour.icon}
            alt={hour.shortForecast}
            className="rounded-image w-100 mx-auto"
          />
        </div>
      )}
      <div style={{ fontVariantNumeric: "tabular-nums" }}>
        {hour.temperature.degrees}°{hour.temperature.unit}
      </div>
      <div>{windDisplay || null}</div>
      <div className="text-left">{hour.shortForecast}</div>
    </div>
  );
};

export default HourlyForecast;

const Wrapper: React.FC<{
  children: ReactNode;
  isError?: boolean;
}> = ({ children, isError }) => {
  const { isSmall } = useContext(WindowSizeContext);
  return (
    <div
      className={`${!isSmall && "forecast-wrapper"}  mb-0 md:mb-8`}
      style={{
        display: "grid",
        gridTemplateColumns: isSmall || isError ? "1fr" : "1fr 1fr",
        gridColumnGap: isSmall ? "1rem" : "2rem"
      }}
    >
      {children}
    </div>
  );
};

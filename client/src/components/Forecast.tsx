import React, { useState } from "react";
import "./Forecast.css";
import MarineForecast from "./MarineForecast";
import WeatherForecast from "./WeatherForecast";
import HourlyForecast from "./HourlyForecast";

interface Props {
  locationId: string;
}

export enum ForecastType {
  Weather = "weather",
  Hourly = "hourly"
}

const Forecast: React.FC<Props> = ({ locationId }) => {
  const [forecastType, setForecastType] = useState(ForecastType.Weather);
  return (
    <div>
      <div className="forecast-grid mb-8">
        <MarineForecast locationId={locationId} />
        {forecastType === ForecastType.Weather ? (
          <WeatherForecast
            locationId={locationId}
            setForecastType={setForecastType}
          />
        ) : (
          <HourlyForecast
            locationId={locationId}
            setForecastType={setForecastType}
          />
        )}
      </div>
    </div>
  );
};

export default Forecast;

import React from "react";
import "./Forecast.css";
import MarineForecast from "./MarineForecast";
import WeatherForecast from "./WeatherForecast";

interface Props {
  locationId: string;
}
const Forecast: React.FC<Props> = ({ locationId }) => {
  return (
    <div className="forecast-grid mb-8">
      <MarineForecast locationId={locationId} />
      <WeatherForecast locationId={locationId} />
    </div>
  );
};

export default Forecast;

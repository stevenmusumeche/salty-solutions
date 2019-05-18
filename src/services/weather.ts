import axios from "axios";

export const getForecast = async (location: any) => {
  const url = `${location.weatherApiBase}/forecast`;
  const { data } = await axios.get(url);
  return data.properties.periods;
};

export const getHourlyForecast = async (location: any) => {
  const url = `${location.weatherApiBase}/forecast/hourly`;
  const { data } = await axios.get(url);
  return data.properties.periods;
};

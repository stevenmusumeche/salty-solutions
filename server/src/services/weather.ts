import axios from "axios";
import axiosRetry from "axios-retry";
import { LocationEntity, makeCacheKey } from "./location";
import { format, subHours } from "date-fns";
import orderBy from "lodash/orderBy";
import { degreesToCompass } from "./usgs/source"; // todo: util
import { WeatherForecast } from "../generated/graphql";
import { parseWindDirection } from "./utils";
import { getCacheVal, setCacheVal } from "./db";

axiosRetry(axios, { retries: 3, retryDelay: (retryCount) => retryCount * 500 });

// https://w1.weather.gov/xml/current_obs/seek.php?state=la&Find=Find

/**
   How do I discover weather data using the API?
  The API uses linked data to allow applications to discover content. Similar to a web site that provides HTML links to help users navigate to each page; linked data helps applications navigate to each endpoint. The /points/location endpoint is the most common endpoint to discover additional API content given the popularity of weather data based upon a location (latitude and longitude).

  For example, to discover the endpoint of the raw forecast, the application would first request:

  https://api.weather.gov/points/39.7456,-97.0892
  This response tells the application where to find relative information–including office, zone and forecast data–for a given point. The application can then use the linked data in the previous response to locate the raw forecast:

  https://api.weather.gov/gridpoints/TOP/31,80
  If an application knows the office and grid position for a location (through caching—a similar concept to a bookmark for users), the link data would not be needed to locate the content for raw forecast data.


  get list of all stations here:
https://w1.weather.gov/xml/current_obs/seek.php?state=la&Find=Find
  */

export const getForecast = async (
  location: LocationEntity
): Promise<WeatherForecast[]> => {
  try {
    let url = `${location.weatherGov.apiBase}/forecast`;
    const { data } = await axios.get(url);
    return data.properties.periods.map(parseForecast);
  } catch (e) {
    console.warn("Error getting forecast for ", location.name);
    return [];
  }
};

export const getHourlyForecast = async (
  location: LocationEntity
): Promise<WeatherForecast[]> => {
  const url = `${location.weatherGov.apiBase}/forecast/hourly`;
  const { data } = await axios.get(url);
  return data.properties.periods.map(parseForecast);
};

const parseForecast = (x: any) => {
  const {
    chanceOfPrecipitation,
    windSpeed,
    windDirection,
    temperature,
  } = extractForecast(x);
  return {
    ...x,
    windSpeed,
    windDirection,
    chanceOfPrecipitation,
    temperature,
  };
};

const extractForecast = ({
  detailedForecast,
  windSpeed,
  windDirection,
  temperature,
  temperatureUnit,
}: any) => {
  let extracted = {
    temperature: { degrees: temperature, unit: temperatureUnit },
  } as Partial<WeatherForecast>;

  let matches;

  // chance of precipitation
  if (detailedForecast.includes("precipitation")) {
    matches = detailedForecast.match(/precipitation( is )?([\d]{1,2})%/ims);
    if (matches) extracted.chanceOfPrecipitation = Number(matches[2]);
  } else {
    extracted.chanceOfPrecipitation = 0;
  }

  // wind speed
  if (windSpeed) {
    matches = windSpeed.match(
      /^((?<from>[\d]{1,2}) to )?(?<to>[\d]{1,2}) mph$/ims
    );
  }

  // wind direction
  if (windDirection) {
    extracted.windDirection = parseWindDirection(windDirection);
  }

  if (matches && matches.groups) {
    extracted.windSpeed = {
      from: matches.groups.from
        ? Number(matches.groups.from)
        : Number(matches.groups.to),
      to: Number(matches.groups.to),
    };
  }

  return extracted;
};

export const getConditions = async (
  location: LocationEntity,
  startDate: Date,
  endDate: Date
) => {
  const start = format(startDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
  const end = format(endDate, "yyyy-MM-dd'T'HH:mm:ssXXX");

  const url = `https://api.weather.gov/stations/${location.weatherGov.stationId}/observations?end=${end}&start=${start}`;

  const { data } = await axios.get<any>(url);

  let temperature = data.features.map((x: any) => ({
    timestamp: x.properties.timestamp,
    temperature: {
      degrees: parseFloat(celciusToFahrenheit(x.properties.temperature.value)),
      unit: "F",
    },
  }));
  temperature = orderBy(temperature, ["timestamp"], ["asc"]);

  let wind = data.features
    .filter((x: any) => !!x.properties.windDirection.value)
    .map((x: any) => ({
      timestamp: x.properties.timestamp,
      speed: kilometersPerHourToMph(x.properties.windSpeed.value),
      directionDegrees: x.properties.windDirection.value,
      direction: degreesToCompass(x.properties.windDirection.value),
    }));

  return { temperature, wind };
};

export const getLatestConditions = async (
  location: LocationEntity
): Promise<any> => {
  const cacheKey = makeCacheKey(location, "latest-conditions");
  const cachedData = await getCacheVal(cacheKey, 15); // fresh for 15 minutes
  if (cachedData) return cachedData;

  const data = await getConditions(
    location,
    subHours(new Date(), 48),
    new Date()
  );

  const result = {
    temperature: orderBy(data.temperature, ["timestamp"], ["desc"])[0],
    wind: orderBy(data.wind, ["timestamp"], ["desc"])[0],
  };

  return setCacheVal(cacheKey, result);
};

interface NWSLatestObservations {
  properties: {
    timestamp: string;
    temperature: NWSValue;
    windDirection: NWSValue;
    windSpeed: NWSValue;
    visibility: NWSValue;
    maxTemperatureLast24Hours: NWSValue;
    minTemperatureLast24Hours: NWSValue;
    precipitationLastHour: NWSValue;
    precipitationLast3Hours: NWSValue;
    precipitationLast6Hours: NWSValue;
    relativeHumidity: NWSValue;
    windChill: NWSValue;
    heatIndex: NWSValue;
  };
}

interface NWSValue {
  value: number;
  unitCode: string;
  qualityControl: string;
}

export function celciusToFahrenheit(celcius: number) {
  return (celcius * 1.8 + 32).toFixed(1);
}

function kilometersPerHourToMph(mps: number) {
  return mps / 1.609;
}

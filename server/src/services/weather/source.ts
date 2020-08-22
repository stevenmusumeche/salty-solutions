import { LocationEntity, getById } from "../location";
import { subHours, format, addDays } from "date-fns";
import axios from "axios";
import axiosRetry from "axios-retry";
import { orderBy, pick } from "lodash";
import { degreesToCompass } from "../usgs/source";
import { batchWrite, put } from "../db";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { WeatherForecast } from "../../generated/graphql";
import { parseWindDirection } from "../utils";
type WriteRequest = DocumentClient.WriteRequest;
type PutItemInputAttributeMap = DocumentClient.PutItemInputAttributeMap;

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

export async function storeWeatherConditions(
  locationId: string,
  numHours = 24
) {
  const location = getById(locationId);
  if (!location) throw new Error(`Unable to load location for ${locationId}`);
  const endDate = new Date();
  const startDate = subHours(endDate, numHours);

  const { temperature, wind } = await fetchConditions(
    location,
    startDate,
    endDate
  );

  await saveWeatherConditionsToDynamo(location, temperature, wind);
}

async function saveWeatherConditionsToDynamo(
  location: LocationEntity,
  temperature: TemperatureCondition[],
  wind: WindCondition[]
) {
  const queries = buildWeatherConditionsQueries(location, temperature, wind);
  await batchWrite(queries);
}

function buildWeatherConditionsQueries(
  location: LocationEntity,
  temperature: TemperatureCondition[],
  wind: WindCondition[]
): WriteRequest[] {
  const temperatureQueries = buildTemperatureDynamoQueries(
    location.id,
    temperature
  );
  const windQueries = buildWindDynamoQueries(location.id, wind);
  return [...temperatureQueries, ...windQueries];
}

function buildTemperatureDynamoQueries(
  locationId: string,
  temperature: TemperatureCondition[]
): WriteRequest[] {
  const queries = temperature.map((data) => {
    const { timestamp, temperature } = data;
    const itemDate = new Date(timestamp);
    return {
      PutRequest: {
        Item: {
          pk: `weather-condition-temperature-${locationId}`,
          sk: itemDate.getTime(),
          updatedAt: new Date().toISOString(),
          data: temperature,
        },
      },
    };
  });

  return queries;
}

function buildWindDynamoQueries(
  locationId: string,
  wind: WindCondition[]
): WriteRequest[] {
  const queries = wind.map((data) => {
    const { timestamp, ...itemData } = data;
    const itemDate = new Date(timestamp);
    return {
      PutRequest: {
        Item: {
          pk: `weather-condition-wind-${locationId}`,
          sk: itemDate.getTime(),
          updatedAt: new Date().toISOString(),
          data: itemData,
        },
      },
    };
  });

  return queries;
}

export interface WindCondition {
  timestamp: string;
  speed: number;
  directionDegrees: number;
  direction: string;
}
export interface TemperatureCondition {
  timestamp: string;
  temperature: { degrees: number; unit: string };
}
interface ConditionsResponse {
  temperature: TemperatureCondition[];
  wind: WindCondition[];
}

const fetchConditions = async (
  location: LocationEntity,
  startDate: Date,
  endDate: Date
): Promise<ConditionsResponse> => {
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

export async function storeWeatherForecast(locationId: string) {
  const location = getById(locationId);
  if (!location) throw new Error(`Unable to load location for ${locationId}`);
  const data = await fetchForecast(location);
  await saveWeatherForecastToDynamo(location, data);
}

export async function storeHourlyWeatherForecast(locationId: string) {
  const location = getById(locationId);
  if (!location) throw new Error(`Unable to load location for ${locationId}`);
  const data = await fetchHourlyForecast(location);
  const queries = buildHourlyForecastDynamoQueries(locationId, data);
  await batchWrite(queries);
}

export const fetchHourlyForecast = async (
  location: LocationEntity
): Promise<WeatherForecast[]> => {
  const url = `${location.weatherGov.apiBase}/forecast/hourly`;
  const { data } = await axios.get(url);
  return data.properties.periods.map(parseForecast);
};

function buildHourlyForecastDynamoQueries(
  locationId: string,
  data: WeatherForecast[]
): WriteRequest[] {
  const queries = data.map((datum) => {
    const { startTime } = datum;
    const itemDate = new Date(startTime);
    return {
      PutRequest: {
        Item: {
          pk: `weather-forecast-hourly-${locationId}`,
          sk: itemDate.getTime(),
          updatedAt: new Date().toISOString(),
          data: datum,
          ttl: addDays(new Date(), 30).getTime(),
        },
      },
    };
  });

  return queries;
}

async function saveWeatherForecastToDynamo(
  location: LocationEntity,
  data: WeatherForecast[]
) {
  const item = buildWeatherForecastQuery(location, data);
  await put(item);
}

function buildWeatherForecastQuery(
  location: LocationEntity,
  data: WeatherForecast[]
): PutItemInputAttributeMap {
  const itemData = data.map((datum) =>
    pick(datum, [
      "name",
      "startTime",
      "endTime",
      "isDaytime",
      "shortForecast",
      "detailedForecast",
      "temperature",
      "windSpeed",
      "windDirection",
      "icon",
      "chanceOfPrecipitation",
    ])
  );

  return {
    Item: {
      pk: `weather-forecast-${location.id}`,
      sk: new Date().getTime(),
      updatedAt: new Date().toISOString(),
      data: itemData,
      ttl: addDays(new Date(), 30).getTime(),
    },
  };
}

const fetchForecast = async (
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

function celciusToFahrenheit(celcius: number) {
  return (celcius * 1.8 + 32).toFixed(1);
}

function kilometersPerHourToMph(mps: number) {
  return mps / 1.609;
}

import { LocationEntity, getById } from "../location";
import { subHours, format } from "date-fns";
import axios from "axios";
import axiosRetry from "axios-retry";
import { orderBy } from "lodash";
import { degreesToCompass } from "../usgs/source";
import { batchWrite } from "../db";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
type WriteRequest = DocumentClient.WriteRequest;

axiosRetry(axios, { retries: 3, retryDelay: (retryCount) => retryCount * 500 });

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

  await saveToDynamo(location, temperature, wind);
}

async function saveToDynamo(
  location: LocationEntity,
  temperature: TemperatureCondition[],
  wind: WindCondition[]
) {
  const queries = buildQueries(location, temperature, wind);
  await batchWrite(queries);
}

function buildQueries(
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

interface WindCondition {
  timestamp: string;
  speed: number;
  directionDegrees: number;
  direction: string;
}
interface TemperatureCondition {
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

function celciusToFahrenheit(celcius: number) {
  return (celcius * 1.8 + 32).toFixed(1);
}

function kilometersPerHourToMph(mps: number) {
  return mps / 1.609;
}

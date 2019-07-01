import xray from "x-ray";
var x = xray();

export const getForecast = async (
  location: any
): Promise<{ timePeriod: string; forecast: string }[]> => {
  const url = `http://marine.weather.gov/MapClick.php?zoneid=${
    location.marineZoneId
  }&zflg=1`;
  const result = await x(url, "#detailed-forecast-body", {
    labels: [".row-forecast .forecast-label"],
    texts: [".row-forecast .forecast-text"]
  });

  const forecast = [];
  for (let i = 0; i < result.labels.length; i++) {
    forecast.push({
      timePeriod: result.labels[i].trim(),
      forecast: result.texts[i].trim()
    });
  }

  return forecast;
};

// calcasieu lake: https://forecast.weather.gov/shmrn.php?mz=gmz432
// sabine lake: https://forecast.weather.gov/shmrn.php?mz=gmz430
// vermillion bay: https://forecast.weather.gov/shmrn.php?mz=gmz435
// cocodrie: gmz550

// base page: https://www.weather.gov/lch/marine

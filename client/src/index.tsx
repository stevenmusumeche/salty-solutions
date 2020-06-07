import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "whatwg-fetch";

import App from "./App";
import {
  Provider as UrqlProvider,
  createClient,
  dedupExchange,
  fetchExchange,
} from "urql";
import { devtoolsExchange } from "@urql/devtools";
import { cacheExchange } from "@urql/exchange-graphcache";
import { Router, Redirect, RouteComponentProps } from "@reach/router";
import About from "./components/About";
import MediaQueryProvider from "./providers/WindowSizeProvider";
import { useState } from "react";
import "intersection-observer";

export const INITIAL_LOCATION = "calcasieu-lake";

const client = createClient({
  url: (process.env.REACT_APP_API_URL as string) || "http://localhost:4000/api",
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    cacheExchange({
      keys: {
        Coords: () => null,
        TideDetail: () => null,
        Wind: () => null,
        WindSummary: () => null,
        WindDetail: () => null,
        TemperatureResult: () => null,
        TemperatureSummary: () => null,
        TemperatureDetail: () => null,
        Temperature: () => null,
        WindDirection: () => null,
        RainDetail: () => null,
        ForecastWindDetailV2: () => null,
        Salinity: () => null,
        SalinitySummary: () => null,
        SalinityDetail: () => null,
        WaterHeight: () => null,
        WaterTemperature: () => null,
        WaterTemperatureSummary: () => null,
        SunDetail: () => null,
        CombinedForecastV2: (data: any) => data.date,
        ForecastDescription: () => null,
        MoonDetail: () => null,
        ModisMapEntry: (data: any) => data.url,
        ModisMap: (data: any) => data.date,
        WeatherForecast: () => null,
        ForecastWindSpeedDetail: () => null,
      },
    }),
    fetchExchange,
  ],
});

const Home: React.FC<RouteComponentProps> = () => {
  const [locationId, setLocationId] = useState<string>("");
  useEffect(() => {
    setLocationId(localStorage.getItem("locationId") || INITIAL_LOCATION);
  }, []);

  if (!locationId) return null;

  return <Redirect from="/" to={locationId} noThrow />;
};

const Root = () => {
  return (
    <MediaQueryProvider>
      <UrqlProvider value={client}>
        <Router>
          <About path="/about" />
          <App path="/:locationSlug" />
          <Home path="/" />
        </Router>
      </UrqlProvider>
    </MediaQueryProvider>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

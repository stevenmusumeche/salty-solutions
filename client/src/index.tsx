import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "whatwg-fetch";
import bugsnag from "@bugsnag/js";
import bugsnagReact from "@bugsnag/plugin-react";

import App from "./App";
import { Provider as UrqlProvider, createClient } from "urql";
import { Router, Redirect } from "@reach/router";
import About from "./components/About";
import useLocalStorage from "./hooks/useLocalStorage";
import MediaQueryProvider from "./providers/WindowSizeProvider";

const bugsnagClient = bugsnag("c1260c2450f57d001639a05b6c1335f7");
bugsnagClient.use(bugsnagReact, React);
const ErrorBoundary = bugsnagClient.getPlugin("react");

bugsnagClient.notify(new Error("Test error"));

export const INITIAL_LOCATION = "calcasieu-lake";

const client = createClient({
  url: (process.env.REACT_APP_API_URL as string) || "http://localhost:4000/api"
});

const Root = () => {
  const [locationId] = useLocalStorage("locationId", INITIAL_LOCATION);

  useEffect(() => {
    const $el = document.getElementById("pre-app-loader");
    if ($el) {
      $el.remove();
    }
  }, []);

  return (
    <ErrorBoundary>
      <MediaQueryProvider>
        <UrqlProvider value={client}>
          <Router>
            <About path="/about" />
            <App path="/:locationSlug" />
            <Redirect from="/" to={`/${locationId}`} noThrow />
          </Router>
        </UrqlProvider>
      </MediaQueryProvider>
    </ErrorBoundary>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

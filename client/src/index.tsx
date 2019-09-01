import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "whatwg-fetch";

import App from "./App";
import { Provider as UrqlProvider, createClient } from "urql";
import { Router, Redirect } from "@reach/router";
import About from "./components/About";
import useLocalStorage from "./hooks/useLocalStorage";
import MediaQueryProvider from "./providers/WindowSizeProvider";

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
    <MediaQueryProvider>
      <UrqlProvider value={client}>
        <Router>
          <About path="/about" />
          <App path="/:locationSlug" />
          <Redirect from="/" to={`/${locationId}`} noThrow />
        </Router>
      </UrqlProvider>
    </MediaQueryProvider>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

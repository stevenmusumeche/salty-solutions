import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "whatwg-fetch";

import App from "./App";
import { Provider as UrqlProvider, createClient } from "urql";
import { Router, Redirect, RouteComponentProps } from "@reach/router";
import About from "./components/About";
import MediaQueryProvider from "./providers/WindowSizeProvider";
import { useState } from "react";

export const INITIAL_LOCATION = "calcasieu-lake";

const client = createClient({
  url: (process.env.REACT_APP_API_URL as string) || "http://localhost:4000/api",
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

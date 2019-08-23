import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { Provider, createClient } from "urql";
import { Router, Redirect } from "@reach/router";
import About from "./components/About";
import Contact from "./components/Contact";
import useLocalStorage from "./hooks/useLocalStorage";

const client = createClient({
  url: (process.env.REACT_APP_API_URL as string) || "http://localhost:4000/api"
});

const Root = () => {
  const INITIAL_LOCATION = "calcasieu-lake";
  const [locationId] = useLocalStorage("locationId", INITIAL_LOCATION);

  return (
    <Provider value={client}>
      <Router>
        <About path="/about" />
        <Contact path="/contact" />
        <App path="/:locationSlug" />
        <Redirect from="/" to={`/${locationId}`} noThrow />
      </Router>
    </Provider>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

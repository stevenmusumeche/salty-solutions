import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { Provider, createClient } from "urql";
import { Router, Redirect, navigate } from "@reach/router";
import About from "./components/About";
import Contact from "./components/Contact";

// todo
const NotFound: any = () => <p>Sorry, nothing here</p>;

const client = createClient({
  url: (process.env.REACT_APP_API_URL as string) || "http://localhost:4000/api"
});

const INITIAL_LOCATION = "2";

ReactDOM.render(
  <Provider value={client}>
    <Router>
      <App path="/:locationSlug" />
      <About path="/about" />
      <Contact path="/contact" />
      <Redirect from="/" to={`/${INITIAL_LOCATION}`} noThrow />
      <NotFound default />
    </Router>
  </Provider>,
  document.getElementById("root")
);

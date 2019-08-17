import React from "react";
import ReactDOM from "react-dom";
import "./css/build.css";
import App from "./App";
import { Provider, createClient } from "urql";

const client = createClient({
  url: process.env.REACT_APP_API_URL as string
});

ReactDOM.render(
  <Provider value={client}>
    <App />
  </Provider>,
  document.getElementById("root")
);

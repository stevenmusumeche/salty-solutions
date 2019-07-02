import React from "react";
import ReactDOM from "react-dom";
import "./css/build.css";
import App from "./App";
import { Provider, createClient } from "urql";

const client = createClient({
  url: "http://localhost:4000/api"
});

ReactDOM.render(
  <Provider value={client}>
    <App />
  </Provider>,
  document.getElementById("root")
);

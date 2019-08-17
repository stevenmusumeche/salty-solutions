import React from "react";
import ReactDOM from "react-dom";
import "./css/build.css";
import App from "./App";
import { Provider, createClient } from "urql";

const client = createClient({
  url:
    process.env.NODE_ENV === "production"
      ? (process.env.REACT_APP_API_URL as string)
      : (process.env.REACT_APP_LOCAL_API_URL as string)
});

ReactDOM.render(
  <Provider value={client}>
    <App />
  </Provider>,
  document.getElementById("root")
);

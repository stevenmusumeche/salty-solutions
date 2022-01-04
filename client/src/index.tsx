import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "whatwg-fetch";
import App from "./App";
import { Provider as UrqlProvider, createClient, defaultExchanges } from "urql";
import { devtoolsExchange } from "@urql/devtools";
import { Router, Redirect, RouteComponentProps } from "@reach/router";
import About from "./components/About";
import Privacy from "./components/Privacy";
import Admin from "./components/Admin";
import MediaQueryProvider from "./providers/WindowSizeProvider";
import { useState } from "react";
import "intersection-observer";
import { Auth0Provider } from "@auth0/auth0-react";
import EmbedCurrentConditions from "./components/embeds/EmbedCurrentConditions";
import { Platform } from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import { FeatureFlagProvider } from "@stevenmusumeche/salty-solutions-shared";

export const INITIAL_LOCATION = "calcasieu-lake";

const client = createClient({
  url: (process.env.REACT_APP_API_URL as string) || "http://localhost:4000/api",
  exchanges: [devtoolsExchange as any, ...defaultExchanges],
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
    <Auth0Provider
      domain="dev-nzoppbnb.us.auth0.com"
      clientId="sckIN4Lc5FJ2XPsZ4r72OkRVBx242OOw"
      redirectUri={window.location.origin}
    >
      <MediaQueryProvider>
        <UrqlProvider value={client}>
          <FeatureFlagProvider platform={Platform.Web}>
            <Router>
              <About path="/about" />
              <Admin path="/admin" />
              <Privacy path="/privacy" />
              <EmbedCurrentConditions path="/embed/now" />
              <App path="/:locationSlug" />
              <Home path="/" />
            </Router>
          </FeatureFlagProvider>
        </UrqlProvider>
      </MediaQueryProvider>
    </Auth0Provider>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

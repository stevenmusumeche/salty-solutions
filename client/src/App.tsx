import { navigate, RouteComponentProps } from "@reach/router";
import { useLocationsQuery } from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import {
  useTideStationSites,
  useWaterHeightSites,
} from "@stevenmusumeche/salty-solutions-shared/dist/hooks";
import { startOfDay } from "date-fns";
import React, { useEffect, useMemo, useReducer, useState } from "react";
import "./App.css";
import AppHeader from "./components/AppHeader";
import CollapsibleSection from "./components/CollapsibleSection";
import CombinedForecastV2 from "./components/CombinedForecastV2";
import CurrentConditions from "./components/CurrentConditions";
import DarkSkyRadar from "./components/DarkSkyRadar";
import Donate from "./components/Donate";
import HourlyForecast from "./components/HourlyForecast";
import JumpNav from "./components/JumpNav";
import ModisMap from "./components/ModisMap";
import NotFound from "./components/NotFound";
import { SalinityMap } from "./components/SalinityMap";
import Shell from "./components/Shell";
import Tides from "./components/tide/Tides";
import { useAuth0 } from "@auth0/auth0-react";

export interface Action {
  type: string;
  payload?: string;
}

interface State {
  [section: string]: boolean;
}

const initialState = {
  radar: false,
  satellite: false,
  salinity: false,
  hourlyForecast: false,
};

const sectionReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "toggle":
      if (!action.payload) return state;
      return { ...state, [action.payload]: !state[action.payload] };
    case "nav-clicked":
      if (!action.payload) return state;
      return {
        radar: false,
        satellite: false,
        salinity: false,
        hourlyForecast: false,
        [action.payload]: true,
      };
    case "collapse-all":
      return {
        radar: false,
        satellite: false,
        salinity: false,
        hourlyForecast: false,
      };
    default:
      return state;
  }
};

const App: React.FC<RouteComponentProps<{ locationSlug: string }>> = ({
  locationSlug,
}) => {
  const { isLoading: isAuth0Loading } = useAuth0();
  const [sections, dispatch] = useReducer(sectionReducer, initialState);
  const [locations] = useLocationsQuery();
  const [locationId, setLocationId] = useState(locationSlug!);
  useEffect(() => {
    const $el = document.getElementById("pre-app-loader");
    if ($el) {
      $el.remove();
    }
  }, []);

  useEffect(() => {
    if (!locationSlug) return;
    localStorage.setItem("locationId", locationSlug);
  }, [locationSlug]);

  const selectedLocation = useMemo(() => {
    return locations.data
      ? locations.data.locations.find((location) => location.id === locationId)
      : null;
  }, [locationId, locations.data]);

  const [date, setDate] = useState(() => startOfDay(new Date()));

  const handleDateChange = (date: Date | Date[]) => {
    if (Array.isArray(date)) return;
    setDate(date);
  };

  const waterHeightSites = useWaterHeightSites(selectedLocation);
  const tideStations = useTideStationSites(selectedLocation);

  if (locations.fetching || isAuth0Loading) {
    return null;
  }

  if (!selectedLocation) {
    return <NotFound locationSlug={locationSlug!} />;
  }

  return (
    <Shell header={<AppHeader />}>
      <JumpNav
        dispatch={dispatch}
        locations={locations}
        setLocationId={(id) => {
          setLocationId(id);
          window.scrollTo({ top: 0 });
          navigate(`/${id}`);
        }}
        activeLocationId={locationId}
      />
      <div className="container p-4 md:p-0 md:mx-auto md:my-0 md:mt-8">
        <CurrentConditions location={selectedLocation} />

        <span id="tides"></span>
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 md:mb-8">
          <Tides
            locationId={locationId}
            tideStations={tideStations}
            sites={waterHeightSites}
            date={date}
            setActiveDate={handleDateChange}
          />
        </div>

        <Donate />

        <span id="forecast"></span>
        <CombinedForecastV2 locationId={locationId} />

        <span id="radar"></span>
        <CollapsibleSection
          title="Radar"
          visible={sections.radar}
          toggleVisible={() => dispatch({ type: "toggle", payload: "radar" })}
        >
          <DarkSkyRadar coords={selectedLocation.coords} />
        </CollapsibleSection>

        <span id="satellite"></span>
        <CollapsibleSection
          title="Satellite Imagery"
          visible={sections.satellite}
          toggleVisible={() =>
            dispatch({ type: "toggle", payload: "satellite" })
          }
        >
          <ModisMap locationId={locationId} />
        </CollapsibleSection>

        <span id="salinity-map"></span>
        <CollapsibleSection
          title="Salinity Map"
          visible={sections.salinity}
          toggleVisible={() =>
            dispatch({ type: "toggle", payload: "salinity" })
          }
        >
          <SalinityMap locationId={locationId} />
        </CollapsibleSection>

        <span id="hourly-forecast"></span>
        <CollapsibleSection
          title="Hourly Forecast"
          visible={sections.hourlyForecast}
          toggleVisible={() =>
            dispatch({ type: "toggle", payload: "hourlyForecast" })
          }
        >
          <HourlyForecast locationId={locationId} />
        </CollapsibleSection>
      </div>
    </Shell>
  );
};

export default App;

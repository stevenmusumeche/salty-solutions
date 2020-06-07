import { startOfDay } from "date-fns";
import React, { useState, useEffect } from "react";
import "./App.css";
import AirTempCard from "./components/AirTempCard";
import SalinityCard from "./components/SalinityCard";
import WaterTempCard from "./components/WaterTempCard";
import WindCard from "./components/WindCard";
import AppHeader from "./components/AppHeader";
import HourlyForecast from "./components/HourlyForecast";
import Tides from "./components/tide/Tides";
import Shell from "./components/Shell";
import NotFound from "./components/NotFound";
import { RouteComponentProps, navigate } from "@reach/router";
import JumpNav from "./components/JumpNav";
import Donate from "./components/Donate";
import CollapsibleSection from "./components/CollapsibleSection";
import DarkSkyRadar from "./components/DarkSkyRadar";
import { SalinityMap } from "./components/SalinityMap";
import ModisMap from "./components/ModisMap";
import { useReducer } from "react";
import CombinedForecastV2 from "./components/CombinedForecastV2";
import {
  useLocationsQuery,
  UsgsParam,
} from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import { useInView } from "react-intersection-observer";

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
  const [forecastRef, forecastInView] = useInView({
    triggerOnce: true,
    rootMargin: "200px",
  });
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

  const selectedLocation = locations.data
    ? locations.data.locations.find((location) => location.id === locationId)
    : null;

  const [date, setDate] = useState(() => startOfDay(new Date()));

  const handleDateChange = (date: Date | Date[]) => {
    if (Array.isArray(date)) return;
    setDate(date);
  };

  if (locations.fetching) {
    return null;
  }

  if (!selectedLocation) {
    return <NotFound locationSlug={locationSlug!} />;
  }

  return (
    <Shell
      header={
        <AppHeader
          locations={locations}
          setLocationId={(id) => {
            setLocationId(id);
            window.scrollTo({ top: 0 });
            navigate(`/${id}`);
          }}
          activeLocationId={locationId}
        />
      }
    >
      <JumpNav dispatch={dispatch} />

      <div className="container p-4 md:p-0 md:mx-auto md:my-0 md:mt-8">
        <span id="current-conditions"></span>
        <div className="current-conditions-grid">
          <WindCard locationId={locationId} />
          <AirTempCard locationId={locationId} />
          <WaterTempCard
            locationId={locationId}
            usgsSites={selectedLocation.usgsSites.filter((site) =>
              site.availableParams.includes(UsgsParam.WaterTemp)
            )}
          />
          <SalinityCard
            locationId={locationId}
            usgsSites={selectedLocation.usgsSites.filter((site) =>
              site.availableParams.includes(UsgsParam.Salinity)
            )}
          />
        </div>

        <span id="tides"></span>
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 md:mb-8">
          <Tides
            locationId={locationId}
            tideStations={selectedLocation.tidePreditionStations}
            usgsSites={selectedLocation.usgsSites.filter((site) =>
              site.availableParams.includes(UsgsParam.GuageHeight)
            )}
            date={date}
            setActiveDate={handleDateChange}
          />
        </div>

        <Donate />

        <span id="forecast" ref={forecastRef}></span>
        {forecastInView && <CombinedForecastV2 locationId={locationId} />}

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

import React, { useReducer, useEffect } from "react";
import Button from "./Button";
import SalinityMap from "./SalinityMap";
import MinusIcon from "../assets/minus-icon.svg";
import PlusIcon from "../assets/plus-icon.svg";
import ModisMap from "./ModisMap";
import useBreakpoints from "../hooks/useBreakpoints";
import { Coords } from "../generated/graphql";
import DarkSkyRadar from "./DarkSkyRadar";

interface Props {
  locationId: string;
  coords: Coords;
}

interface State {
  showRadar: boolean;
  showSalinity: boolean;
  showModis: boolean;
}

interface Action {
  type: string;
  [other: string]: any;
}

const initialState = {
  showRadar: false,
  showSalinity: false,
  showModis: false
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "DISABLE_ALL":
      return {
        ...state,
        showRadar: false,
        showSalinity: false,
        showModis: false
      };
    case "TOGGLE_RADAR":
      return {
        ...state,
        showRadar: !state.showRadar,
        showSalinity: false,
        showModis: false
      };
    case "TOGGLE_SALINITY":
      return {
        ...state,
        showRadar: false,
        showSalinity: !state.showSalinity,
        showModis: false
      };
    case "TOGGLE_MODIS":
      return {
        ...state,
        showRadar: false,
        showSalinity: false,
        showModis: !state.showModis
      };
    default:
      return state;
  }
};

const Maps: React.FC<Props> = ({ locationId, coords }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { isSmall, isAtLeastMedium } = useBreakpoints();

  useEffect(() => {
    dispatch({ type: "DISABLE_ALL" });
  }, [locationId]);

  return (
    <div>
      <div className="flex flex-col md:flex-row">
        <SalinityButton
          showSalinity={state.showSalinity}
          toggle={() => dispatch({ type: "TOGGLE_SALINITY" })}
        />
        {state.showSalinity && isSmall && (
          <SalinityMap locationId={locationId} />
        )}
        <ModisButton
          show={state.showModis}
          toggle={() => dispatch({ type: "TOGGLE_MODIS" })}
        />
        {state.showModis && isSmall && <ModisMap locationId={locationId} />}
        <RadarButton
          showRadar={state.showRadar}
          toggleRadar={() => dispatch({ type: "TOGGLE_RADAR" })}
        />
        {state.showRadar && isSmall && <DarkSkyRadar coords={coords} />}
      </div>

      {state.showSalinity && isAtLeastMedium && (
        <SalinityMap locationId={locationId} />
      )}
      {state.showModis && isAtLeastMedium && (
        <ModisMap locationId={locationId} />
      )}
      {state.showRadar && isAtLeastMedium && (
        // <RadarMap locationId={locationId} />
        <DarkSkyRadar coords={coords} />
      )}
    </div>
  );
};

export default Maps;

const RadarButton: React.FC<{
  showRadar: boolean;
  toggleRadar: () => void;
}> = ({ showRadar, toggleRadar }) => (
  <Button
    className={`w-full md:w-80 flex mb-4 md:mb-8 md:mr-8`}
    onClick={e => {
      e.preventDefault();
      toggleRadar();
    }}
  >
    <div>{showRadar ? "Hide " : "Show "} Radar</div>{" "}
    <img
      className="w-4 ml-6"
      src={showRadar ? MinusIcon : PlusIcon}
      alt="radar icon"
    />
  </Button>
);

const SalinityButton: React.FC<{
  showSalinity: boolean;
  toggle: () => void;
}> = ({ showSalinity, toggle }) => (
  <Button
    className={`w-full md:w-80 flex mb-4 md:mb-8 md:mr-8`}
    onClick={e => {
      e.preventDefault();
      toggle();
    }}
  >
    <div>{showSalinity ? "Hide " : "Show "} Salinity Forecast</div>{" "}
    <img
      className="w-4 ml-6"
      src={showSalinity ? MinusIcon : PlusIcon}
      alt="salinity icon"
    />
  </Button>
);

const ModisButton: React.FC<{
  show: boolean;
  toggle: () => void;
}> = ({ show, toggle }) => (
  <Button
    className={`w-full md:w-80 flex mb-4 md:mb-8 md:mr-8`}
    onClick={e => {
      e.preventDefault();
      toggle();
    }}
  >
    <div>{show ? "Hide " : "Show "} Latest Satellite</div>{" "}
    <img
      className="w-4 ml-6"
      src={show ? MinusIcon : PlusIcon}
      alt="modis icon"
    />
  </Button>
);

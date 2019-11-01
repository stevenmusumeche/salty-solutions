import React, { useReducer, useEffect } from "react";
import Button from "./Button";
import SalinityMap from "./SalinityMap";
import RadarMap from "./RadarMap";
import MinusIcon from "../assets/minus-icon.svg";
import PlusIcon from "../assets/plus-icon.svg";
import ModisMap from "./ModisMap";

interface Props {
  locationId: string;
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

const Maps: React.FC<Props> = ({ locationId }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "DISABLE_ALL" });
  }, [locationId]);

  return (
    <>
      <div className="flex">
        <RadarButton
          showRadar={state.showRadar}
          toggleRadar={() => dispatch({ type: "TOGGLE_RADAR" })}
        />
        <SalinityButton
          showSalinity={state.showSalinity}
          toggle={() => dispatch({ type: "TOGGLE_SALINITY" })}
        />
        <ModisButton
          show={state.showModis}
          toggle={() => dispatch({ type: "TOGGLE_MODIS" })}
        />
      </div>
      {state.showRadar && <RadarMap locationId={locationId} />}
      {state.showSalinity && <SalinityMap locationId={locationId} />}
      {state.showModis && <ModisMap locationId={locationId} />}
    </>
  );
};

export default Maps;

const RadarButton: React.FC<{
  showRadar: boolean;
  toggleRadar: () => void;
}> = ({ showRadar, toggleRadar }) => (
  <Button className={`w-80 hidden md:flex mb-8 mr-8`} onClick={toggleRadar}>
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
  <Button className={`w-80 hidden md:flex mb-8 mr-8`} onClick={toggle}>
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
  <Button className={`w-80 hidden md:flex mb-8 mr-8`} onClick={toggle}>
    <div>{show ? "Hide " : "Show "} Latest Satellite</div>{" "}
    <img
      className="w-4 ml-6"
      src={show ? MinusIcon : PlusIcon}
      alt="modis icon"
    />
  </Button>
);

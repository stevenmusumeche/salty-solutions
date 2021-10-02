import React, { useCallback, useState, SyntheticEvent } from "react";
import RightArrow from "../assets/arrow-right.svg";
import useBreakpoints from "../hooks/useBreakpoints";
import { Action } from "../App";
import { UseQueryState } from "urql";
import { LocationsQuery } from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import LocationSelect from "./LocationSelect";

let BUFFER = 20;

interface Props {
  dispatch: React.Dispatch<Action>;
  locations: UseQueryState<LocationsQuery>;
  setLocationId: (id: string) => void;
  activeLocationId: string;
}

const JumpNav: React.FC<Props> = ({
  dispatch,
  locations,
  setLocationId,
  activeLocationId,
}) => {
  const [arrowVis, setArrowVis] = useState({ left: false, right: true });
  const { isSmall } = useBreakpoints();
  const handleScroll = useCallback(
    (e: SyntheticEvent) => {
      const el = e.target as HTMLDivElement;
      let { left, right } = arrowVis;
      if (el.scrollLeft <= BUFFER) {
        left = false;
      } else {
        left = true;
      }

      if (el.scrollWidth - (el.clientWidth + el.scrollLeft) <= BUFFER) {
        right = false;
      } else {
        right = true;
      }
      if (arrowVis.left !== left || arrowVis.right !== right) {
        setArrowVis({ left, right });
      }
    },
    [arrowVis]
  );

  const renderLocationSelect = () => (
    <LocationSelect
      locations={locations}
      onChange={(e) => {
        if (e.target.value !== "header") setLocationId(e.target.value);
      }}
      value={activeLocationId}
    />
  );

  return (
    <div className="sticky z-50 bg-gray-800 top-0">
      <div className="md:hidden w-full py-3 px-4 bg-gray-700">
        {renderLocationSelect()}
      </div>
      <div
        className="container mx-auto md:grid items-center"
        style={isSmall ? {} : { gridTemplateColumns: "1fr 3fr", gap: "6rem" }}
      >
        <div className="hidden md:block">{renderLocationSelect()}</div>
        <div className="flex justify-between items-center">
          {/* left arrow (mobile) */}
          <div className="w-6 bg-gray-800 flex items-center justify-center md:hidden">
            <img
              src={RightArrow}
              alt="arrow"
              style={{
                height: "25%",
                transform: "rotate(180deg)",
                visibility: arrowVis.left ? "visible" : "hidden",
              }}
            />
          </div>
          {/* actual nav buttons */}
          <div
            className="flex overflow-x-auto flex-grow md:justify-end"
            onScroll={handleScroll}
          >
            <NavButton
              targetId="current-conditions"
              onClick={() => dispatch({ type: "collapse-all" })}
            >
              Right Now
            </NavButton>
            <NavButton
              targetId="tides"
              onClick={() => dispatch({ type: "collapse-all" })}
            >
              Tides
            </NavButton>
            <NavButton
              targetId="forecast"
              onClick={() => dispatch({ type: "collapse-all" })}
            >
              Forecast
            </NavButton>
            <NavButton
              targetId="radar"
              onClick={() =>
                dispatch({ type: "nav-clicked", payload: "radar" })
              }
            >
              Radar
            </NavButton>
            <NavButton
              targetId="satellite"
              onClick={() =>
                dispatch({ type: "nav-clicked", payload: "satellite" })
              }
            >
              Satellite
            </NavButton>
            <NavButton
              targetId="salinity-map"
              onClick={() =>
                dispatch({ type: "nav-clicked", payload: "salinity" })
              }
            >
              Salinity
            </NavButton>
            <NavButton
              targetId="hourly-forecast"
              onClick={() =>
                dispatch({ type: "nav-clicked", payload: "hourlyForecast" })
              }
            >
              Hourly
            </NavButton>
          </div>
          {/* right arrow (mobile) */}
          <div className="w-6 bg-gray-800 flex items-center justify-center md:hidden">
            <img
              src={RightArrow}
              alt="arrow"
              style={{
                height: "25%",
                visibility: arrowVis.right ? "visible" : "hidden",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JumpNav;

const StyledNavButton: React.FC<any> = ({ children, ...props }) => (
  <button
    className="focus:outline-none bg-gray-800 text-gray-200 py-4 px-5 text-center block whitespace-no-wrap border-r border-gray-600 uppercase text-xs last:border-r-0 first:pl-2 last:pr-2 md:border-0 hover:underline"
    {...props}
  >
    {children}
  </button>
);

const NavButton: React.FC<{
  targetId: string;
  onClick?: () => void;
}> = ({ children, onClick, targetId }) => {
  const { isSmall } = useBreakpoints();
  return (
    <StyledNavButton
      onClick={(e: MouseEvent) => {
        e.preventDefault();

        if (onClick) onClick();
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (!el) return;
          const yOffset = isSmall ? -120 : -76;
          const y =
            el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }, 100);
      }}
    >
      {children}
    </StyledNavButton>
  );
};

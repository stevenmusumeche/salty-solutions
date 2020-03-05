import React, { useCallback, useState, SyntheticEvent } from "react";
import RightArrow from "../assets/arrow-right.svg";
import useBreakpoints from "../hooks/useBreakpoints";
import { Action } from "../App";

let BUFFER = 20;

interface Props {
  dispatch: React.Dispatch<Action>;
}

const JumpNav: React.FC<Props> = ({ dispatch }) => {
  const { isSmall } = useBreakpoints();
  const [arrowVis, setArrowVis] = useState({ left: false, right: true });
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

  return (
    <div className="sticky z-50 bg-gray-800" style={{ top: isSmall ? 95 : 80 }}>
      <div className="container mx-auto flex justify-between">
        <div className="w-6 bg-gray-800 flex items-center justify-center md:hidden">
          <img
            src={RightArrow}
            alt="arrow"
            style={{
              height: "25%",
              transform: "rotate(180deg)",
              visibility: arrowVis.left ? "visible" : "hidden"
            }}
          />
        </div>
        <div
          className="flex overflow-x-auto flex-grow md:justify-end"
          onScroll={handleScroll}
        >
          <NavButton
            targetId="current-conditions"
            onClick={() => dispatch({ type: "collapse-all" })}
          >
            Conditions
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
            targetId="solunar"
            onClick={() => dispatch({ type: "collapse-all" })}
          >
            Solunar
          </NavButton>
          <NavButton
            targetId="radar"
            onClick={() => dispatch({ type: "nav-clicked", payload: "radar" })}
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
            Hourly Forecast
          </NavButton>
        </div>
        <div className="w-6 bg-gray-800 flex items-center justify-center md:hidden">
          <img
            src={RightArrow}
            alt="arrow"
            style={{
              height: "25%",
              visibility: arrowVis.right ? "visible" : "hidden"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default JumpNav;

const NavButton: React.FC<{
  targetId: string;
  onClick?: () => void;
}> = ({ children, onClick, targetId }) => {
  return (
    <button
      onClick={e => {
        e.preventDefault();

        if (onClick) onClick();
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (!el) return;
          const yOffset = -150;
          const y =
            el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }, 100);
      }}
      className="focus:outline-none bg-gray-800 text-white p-3 px-5 text-center block whitespace-no-wrap border-r border-gray-600 uppercase text-xs last:border-r-0 first:pl-2 last:pr-2 md:border-0 hover:underline"
    >
      {children}
    </button>
  );
};

import React, { useCallback, useState, SyntheticEvent } from "react";
import RightArrow from "../assets/arrow-right.svg";
import useBreakpoints from "../hooks/useBreakpoints";

let BUFFER = 20;

const MobileJumpNav = () => {
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
          <NavButton href="#current-conditions">Conditions</NavButton>
          <NavButton href="#tides">Tides</NavButton>
          <NavButton href="#forecast">Forecast</NavButton>
          <NavButton href="#solunar">Solunar</NavButton>
          <NavButton href="#maps">Maps</NavButton>
          <NavButton href="#hourly-forecast">Hourly Forecast</NavButton>
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

export default MobileJumpNav;

const NavButton: React.FC<{ href: string }> = ({ children, href }) => (
  <a
    href={href}
    className="bg-gray-800 text-white p-3 px-5 text-center block whitespace-no-wrap border-r border-gray-600 uppercase text-xs last:border-r-0 first:pl-2 last:pr-2 md:border-0 hover:underline"
  >
    {children}
  </a>
);

import React from "react";
import RightArrow from "../assets/arrow-right.svg";

// todo: make arrow invisible if we're at the edge of the front or back

const MobileJumpNav = () => (
  <div
    className="sticky z-50 md:hidden flex justify-between"
    style={{ top: 95 }}
  >
    <div className="w-6 bg-gray-800 flex items-center justify-center">
      <img
        src={RightArrow}
        alt="arrow"
        style={{ height: "25%", transform: "rotate(180deg)" }}
      />
    </div>
    <div className="flex overflow-x-auto flex-grow">
      <NavButton href="#current-conditions">Conditions</NavButton>
      <NavButton href="#tides">Tides</NavButton>
      <NavButton href="#forecast">Forecast</NavButton>
      <NavButton href="#solunar">Solunar</NavButton>
      <NavButton href="#maps">Maps</NavButton>
      <NavButton href="#hourly-forecast">Hourly Forecast</NavButton>
    </div>
    <div className="w-6 bg-gray-800 flex items-center justify-center">
      <img src={RightArrow} alt="arrow" style={{ height: "25%" }} />
    </div>
  </div>
);

export default MobileJumpNav;

const NavButton: React.FC<{ href: string }> = ({ children, href }) => (
  <a
    href={href}
    className="bg-gray-800 text-white p-3 px-5 text-center block whitespace-no-wrap border-r border-gray-600 uppercase text-xs last:border-r-0"
  >
    {children}
  </a>
);

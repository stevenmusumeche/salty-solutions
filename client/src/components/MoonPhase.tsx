import React from "react";
import FirstQuarter from "../assets/moon-phases/first-quarter.svg";
import FullMoon from "../assets/moon-phases/full-moon.svg";
import LastQuarter from "../assets/moon-phases/last-quarter.svg";
import NewMoon from "../assets/moon-phases/new-moon.svg";
import WaningCrescent from "../assets/moon-phases/waning-crescent.svg";
import WaxingCrescent from "../assets/moon-phases/waxing-crescent.svg";
import WaningGibbous from "../assets/moon-phases/waning-gibbous.svg";
import WaxingGibbous from "../assets/moon-phases/waxing-gibbous.svg";

const MoonPhase: React.FC<{ phase: string }> = ({ phase }) => (
  <div>
    <div className="w-22 h-22 mx-auto">
      <img src={getImageForPhase(phase)} alt={phase} />
    </div>
  </div>
);

export default MoonPhase;

function getImageForPhase(phase: string) {
  switch (phase.toLowerCase()) {
    case "new moon":
      return NewMoon;
    case "full moon":
      return FullMoon;
    case "first quarter":
      return FirstQuarter;
    case "last quarter":
      return LastQuarter;
    case "waxing crescent":
      return WaxingCrescent;
    case "waning crescent":
      return WaningCrescent;
    case "waxing gibbous":
      return WaxingGibbous;
    case "waning gibbous":
      return WaningGibbous;
  }

  throw new Error(`Unknown phase ${phase}`);
}

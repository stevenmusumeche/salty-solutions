import React from "react";
import Choppy from "../assets/water-conditions/choppy.svg";
import LightChop from "../assets/water-conditions/light-chop.svg";
import Rough from "../assets/water-conditions/rough.svg";
import Smooth from "../assets/water-conditions/smooth.svg";
import Unknown from "../assets/water-conditions/unknown.svg";

const WaveIcon: React.FC<{ min: number; max: number }> = ({ min, max }) => {
  let image = Unknown;

  if (max === -Infinity) {
    image = Unknown;
  } else if (max <= 6) {
    image = Smooth;
  } else if (max <= 12) {
    image = LightChop;
  } else if (max <= 18) {
    image = Choppy;
  } else if (max > 18) {
    image = Rough;
  }

  return (
    <div className="w-full flex items-center h-10">
      <img src={image} alt={"waves"} className="w-4/5 h-full mx-auto" />
    </div>
  );
};

export default WaveIcon;

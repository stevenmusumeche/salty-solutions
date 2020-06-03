import React from "react";
import Choppy from "../assets/water-conditions/choppy.svg";
import LightChop from "../assets/water-conditions/light-chop.svg";
import Rough from "../assets/water-conditions/rough.svg";
import Smooth from "../assets/water-conditions/smooth.svg";
import Unknown from "../assets/water-conditions/unknown.svg";

const WaveIcon: React.FC<{ min: number; max: number }> = ({ min, max }) => {
  let image = Unknown;

  if (max <= 6) {
    image = Smooth;
  } else if (max <= 12) {
    image = LightChop;
  } else if (max <= 18) {
    image = Choppy;
  } else {
    image = Rough;
  }

  return (
    <div className="w-full flex items-center h-10">
      <img src={image} alt={"waves"} className="w-full h-full" />
    </div>
  );
};

export default WaveIcon;

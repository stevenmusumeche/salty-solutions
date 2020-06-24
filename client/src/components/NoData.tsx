import React from "react";
import Calendar from "../assets/calendar.svg";

const NoData = () => (
  <div className="text-center h-full flex flex-col items-center justify-center">
    <img src={Calendar} className="w-3/4" alt="data unavailable" />
    <div className="text-xs text-gray-700">No Recent Data Available</div>
  </div>
);

export default NoData;

import { SunDetailFieldsFragment } from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import { format, startOfDay } from "date-fns";
import React, { FC, useMemo } from "react";
import NauticalDusk from "../assets/sun-phases/nautical-dusk.svg";
import Sunrise from "../assets/sun-phases/sunrise.svg";
import Sunset from "../assets/sun-phases/sunset.svg";

interface Props {
  sunData: SunDetailFieldsFragment[];
  date: Date;
}

const ForecastSun: FC<Props> = ({ sunData, date }) => {
  const curDaySunData: SunDetailFieldsFragment = useMemo(
    () =>
      sunData.filter(
        (x) =>
          startOfDay(new Date(x.sunrise)).toISOString() ===
          startOfDay(date).toISOString()
      )[0] || {},
    [sunData, date]
  );

  return (
    <div
      className="p-4 mt-4 bg-gray-100 border-gray-200 border border-l-0 border-r-0"
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}
    >
      <SunDay
        name="nautical dawn"
        value={new Date(curDaySunData.nauticalDawn)}
        icon={NauticalDusk}
      />
      <SunDay
        name="sunrise"
        value={new Date(curDaySunData.sunrise)}
        icon={Sunrise}
      />
      <SunDay
        name="sunset"
        value={new Date(curDaySunData.sunset)}
        icon={Sunset}
      />
      <SunDay
        name="nautical dusk"
        value={new Date(curDaySunData.nauticalDusk)}
        icon={NauticalDusk}
      />
    </div>
  );
};

export default ForecastSun;

const SunDay: FC<{ name: string; value: Date; icon: any }> = ({
  name,
  value,
  icon,
}) => (
  <div className="mr-0 last:mr-0 text-center" style={{ fontSize: ".60rem" }}>
    {/* <div className="">
      <img src={icon} alt={name} className="h-12 mx-auto mb-2" />
    </div> */}
    <div className="text-xl leading-tight">{format(value, "h:mm")}</div>
    <div className="uppercase text-gray-600 tracking-tighter">{name}</div>
  </div>
);

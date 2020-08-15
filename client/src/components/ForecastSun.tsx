import {
  SunDetailFieldsFragment,
  SolunarDetailFieldsFragment,
  SolunarPeriodFieldsFragment,
} from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import { format, startOfDay } from "date-fns";
import React, { FC, useMemo } from "react";
import Stars from "./Stars";

interface Props {
  sunData: SunDetailFieldsFragment[];
  solunarData: SolunarDetailFieldsFragment[];
  date: Date;
}

const ForecastSun: FC<Props> = ({ sunData, solunarData, date }) => {
  const curDaySunData: SunDetailFieldsFragment = useMemo(
    () =>
      sunData.filter(
        (x) =>
          startOfDay(new Date(x.sunrise)).toISOString() ===
          startOfDay(date).toISOString()
      )[0] || {},
    [sunData, date]
  );

  const curDaySolunarData: SolunarDetailFieldsFragment = useMemo(
    () =>
      solunarData.filter(
        (x) =>
          startOfDay(new Date(x.date)).toISOString() ===
          startOfDay(date).toISOString()
      )[0] || {},
    [solunarData, date]
  );

  return (
    <div className="p-4 mt-4 bg-gray-100 border-gray-200 border border-l-0 border-r-0">
      <div className="grid grid-cols-4">
        <SunDay
          name="nautical dawn"
          value={new Date(curDaySunData.nauticalDawn)}
        />
        <SunDay name="sunrise" value={new Date(curDaySunData.sunrise)} />
        <SunDay name="sunset" value={new Date(curDaySunData.sunset)} />
        <SunDay
          name="nautical dusk"
          value={new Date(curDaySunData.nauticalDusk)}
        />
      </div>

      <div className="grid grid-cols-2 mt-4" style={{ fontSize: ".60rem" }}>
        <SolunarPeriod type="Major" periods={curDaySolunarData.majorPeriods} />
        <SolunarPeriod type="Minor" periods={curDaySolunarData.minorPeriods} />
      </div>
      <div className="mt-4 mx-auto w-2/5">
        <Stars score={curDaySolunarData.score} />
        <div className="uppercase text-gray-600 tracking-wider text-center text-xs">
          Solunar Score
        </div>
      </div>
    </div>
  );
};

export default ForecastSun;

const SunDay: FC<{ name: string; value: Date }> = ({ name, value }) => (
  <div className="mr-0 last:mr-0 text-center" style={{ fontSize: ".60rem" }}>
    <div className="text-xl leading-tight">{format(value, "h:mm")}</div>
    <div className="uppercase text-gray-600 tracking-tighter">{name}</div>
  </div>
);

const SolunarPeriod: FC<{
  type: "Major" | "Minor";
  periods: SolunarPeriodFieldsFragment[];
}> = ({ type, periods }) => (
  <div className="flex flex-col items-center justify-end">
    {periods.map((period) => (
      <div key={period.start} className="text-base leading-tight lowercase">
        {format(new Date(period.start), "h:mmaaaaa")} -{" "}
        {format(new Date(period.end), "h:mmaaaaa")}
      </div>
    ))}
    <div className="uppercase text-gray-600 tracking-wider">
      {type} Feeding Periods
    </div>
  </div>
);

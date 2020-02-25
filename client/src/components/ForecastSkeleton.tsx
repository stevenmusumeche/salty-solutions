import React, { useMemo } from "react";
import EmptyBox from "./EmptyBox";
import useBreakpoints from "../hooks/useBreakpoints";

export const ForecastSkeleton: React.FC = () => {
  const { isSmall } = useBreakpoints();
  const titleWidth = useMemo(() => getRandomInt(110, 220), []);
  return (
    <>
      {[...Array(7)].map((x, i) => (
        <div key={i} className={`mb-2 ${isSmall && "forecast-wrapper mb-4"}`}>
          <EmptyBox w={titleWidth} h="2rem" className="mb-2" />
          <EmptyBox w={"100%"} h={140} className="mb-0 md:mb-10" />
        </div>
      ))}
    </>
  );
};

export const HourlyForecastSkeleton: React.FC = () => {
  const titleWidth = useMemo(() => getRandomInt(110, 220), []);
  const lines = [...Array(7)].map((x, i) => (
    <div key={i} className="mb-4 flex last:mb-0">
      <div className="flex-grow">
        <EmptyBox w={"100%"} h={"2rem"} />
      </div>
    </div>
  ));
  return (
    <>
      {[...Array(2)].map((x, i) => (
        <div key={i}>
          <div className="mb-6">
            <EmptyBox w={titleWidth} h={"2rem"} className="my-6" />
            {lines}
          </div>
          <div>
            <EmptyBox w={titleWidth} h={"2rem"} className="my-6" />
            {lines}
          </div>
        </div>
      ))}
    </>
  );
};

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

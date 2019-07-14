import React, { useMemo } from "react";

const Skeleton: React.FC = () => {
  const titleWidth = useMemo(() => getRandomInt(30, 45), []);
  const numLines = useMemo(() => getRandomInt(2, 4), []);
  const lineWidths = useMemo(
    () => [
      getRandomInt(93, 100),
      getRandomInt(93, 100),
      getRandomInt(93, 100),
      getRandomInt(93, 100)
    ],
    []
  );
  return (
    <div className="mt-3 mb-6">
      <div
        className="skeleton-character"
        style={{ width: `${titleWidth}%`, height: "1.5em" }}
      />

      {[...Array(numLines)].map((x, i) => (
        <div
          key={i}
          className="skeleton-character"
          style={{ width: `${lineWidths[i]}%` }}
        />
      ))}
    </div>
  );
};

const ForecastSkeleton: React.FC = () => {
  return (
    <>
      {[...Array(7)].map((x, i) => (
        <Skeleton key={i} />
      ))}
    </>
  );
};

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default ForecastSkeleton;

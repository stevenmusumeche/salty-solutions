import React, { FC } from "react";
import {
  Maybe,
  ForecastDescription,
} from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import { useState } from "react";

interface Props {
  day?: Maybe<ForecastDescription>;
  night?: Maybe<ForecastDescription>;
}

const ForecastText: FC<Props> = ({ day, night }) => {
  const [collapsed, setCollapsed] = useState(true);
  const hasAny =
    !!day?.marine || !!night?.marine || !!day?.detailed || !!night?.detailed;
  const previewText =
    day?.marine || night?.marine || day?.detailed || night?.detailed;
  const truncatedPreviewText =
    previewText?.replace(/^(.{130}[^\s]*).*/, "$1") || "";
  const ellipsis =
    truncatedPreviewText[truncatedPreviewText.length - 1] === "."
      ? ".."
      : "...";

  if (!hasAny) return null;

  if (collapsed) {
    return (
      <div className="mt-4 px-4 leading-snug text-gray-700 text-sm">
        {truncatedPreviewText}
        {ellipsis}{" "}
        <a
          className="text-blue-600 underline"
          href="#show"
          onClick={(e) => {
            e.preventDefault();
            setCollapsed(false);
          }}
        >
          read more
        </a>
      </div>
    );
  }
  return (
    <div className="mt-4 px-4 text-sm" style={{ gridArea: "text" }}>
      {(day?.marine || night?.marine) && (
        <div className="mb-4 leading-snug text-gray-700">
          <div className="tracking-wide uppercase text-gray-600  leading-none uppercase mb-1 font-semibold">
            Marine Forecast
          </div>
          {day?.marine || night?.marine}
        </div>
      )}
      {day?.detailed && (
        <div className="mb-4 leading-snug text-gray-700">
          <div className="tracking-wide uppercase text-gray-600  leading-none uppercase mb-1 font-semibold">
            Daytime Forecast
          </div>
          {day.detailed}
        </div>
      )}
      {night?.detailed && (
        <div className="leading-snug text-gray-700">
          <div className="tracking-wide uppercase text-gray-600  leading-none uppercase mb-1 font-semibold">
            Nighttime Forecast
          </div>
          {night.detailed}
        </div>
      )}
      <div className="mt-4">
        <a
          className="text-blue-600 underline"
          href="#collapse"
          onClick={(e) => {
            e.preventDefault();
            setCollapsed(true);
          }}
        >
          read less
        </a>
      </div>
    </div>
  );
};

export default ForecastText;

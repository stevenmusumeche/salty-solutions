import React, { FC } from "react";
import { Maybe } from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import { useState } from "react";

interface Props {
  day?: Maybe<string>;
  night?: Maybe<string>;
}

const ForecastText: FC<Props> = ({ day, night }) => {
  const [collapsed, setCollapsed] = useState(true);
  const hasAny = !!day || !!night;
  const previewText = day || night;
  const truncatedPreviewText =
    previewText?.replace(/^(.{140}[^\s]*).*/, "$1") || "";
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
      {day && (
        <div className="mb-4 leading-snug text-gray-700">
          <div className="tracking-wide uppercase text-gray-600  leading-none uppercase mb-1 font-semibold">
            Day
          </div>
          {day}
        </div>
      )}
      {night && (
        <div className="leading-snug text-gray-700">
          <div className="tracking-wide uppercase text-gray-600  leading-none uppercase mb-1 font-semibold">
            Night
          </div>
          {night}
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

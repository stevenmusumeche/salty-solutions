import React from "react";

interface Props {
  w: React.CSSProperties["width"];
  h: React.CSSProperties["height"];
  className?: string;
  [rest: string]: any;
}

const EmptyBox: React.FC<Props> = ({ w, h, className, ...rest }) => {
  return (
    <div
      {...rest}
      className={`bg-gray-300 ${className || ""}`}
      style={{ width: w, height: h, ...rest.style }}
    ></div>
  );
};

export default EmptyBox;

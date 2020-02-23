import React from "react";

interface Props {
  w: React.CSSProperties["width"];
  h: React.CSSProperties["height"];
}

const EmptyBox: React.FC<Props> = ({ w, h }) => {
  return <div className="bg-gray-300" style={{ width: w, height: h }}></div>;
};

export default EmptyBox;

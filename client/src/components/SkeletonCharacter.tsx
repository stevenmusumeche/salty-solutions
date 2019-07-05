import React from "react";

interface Props {}

const SkeletonCharacter: React.FC<Props> = ({}) => {
  return (
    <div className="m-auto mt-4 inline-block">
      <div className="skeleton-character" style={{ width: 130 }} />
      <div className="skeleton-character" style={{ width: 100 }} />
      <div className="skeleton-character" />
      <div className="skeleton-character" style={{ width: 120 }} />
    </div>
  );
};

export default SkeletonCharacter;

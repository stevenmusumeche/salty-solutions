import React from "react";

const SkeletonCharacter: React.FC = () => {
  return (
    <div className="m-auto inline-block">
      <div className="skeleton-character" style={{ width: 130 }} />
      <div className="skeleton-character" style={{ width: 100 }} />
      <div className="skeleton-character" />
      <div className="skeleton-character" style={{ width: 120 }} />
    </div>
  );
};

export default SkeletonCharacter;

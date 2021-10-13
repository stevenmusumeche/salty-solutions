import React from "react";

const EmbedWrapper: React.FC = ({ children }) => {
  return (
    <div className="bg-la-tag-lighter relative h-full min-h-screen border border-gray-700 rounded flex flex-col">
      {children}
    </div>
  );
};

export default EmbedWrapper;

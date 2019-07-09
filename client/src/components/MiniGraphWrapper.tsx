import React, { ReactNode } from "react";

const MiniGraphWrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div
    className={`relative bg-white w-full mr-8 rounded-lg shadow-md text-center margin-killer flex-col flex justify-center align-center flex-grow`}
    style={{ minHeight: "12rem" }}
  >
    {children}
  </div>
);

export default MiniGraphWrapper;

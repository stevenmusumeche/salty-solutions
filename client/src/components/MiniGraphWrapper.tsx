import React, { ReactNode } from "react";

const MiniGraphWrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div
    className={`relative bg-white w-full rounded-lg shadow-md text-center flex-col flex justify-center align-center flex-grow`}
    style={{ minHeight: "12rem" }}
  >
    {children}
  </div>
);

export default MiniGraphWrapper;

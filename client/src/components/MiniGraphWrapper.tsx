import React, { ReactNode, useContext } from "react";
import { WindowSizeContext } from "../providers/WindowSizeProvider";

const MiniGraphWrapper: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const { isSmall } = useContext(WindowSizeContext);
  return (
    <div
      className={`${className &&
        className} relative bg-white w-full rounded-lg shadow-md text-center flex-col flex justify-center align-center flex-grow`}
      style={{ minHeight: isSmall ? "8rem" : "12rem" }}
    >
      {children}
    </div>
  );
};

export default MiniGraphWrapper;

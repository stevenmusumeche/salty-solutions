import React, { createContext, FC } from "react";
import useBreakpoints from "../hooks/useBreakpoints";

export const WindowSizeContext = createContext({
  isSmall: false,
  isAtLeastSmall: false,
  isMedium: false,
  isAtLeastMedium: false,
  isLarge: false,
  isAtLeastLarge: false,
  isXL: false,
  isAtLeastXL: false
});

const WindowSizeProvider: FC = ({ children }) => {
  const result = useBreakpoints();

  return (
    <WindowSizeContext.Provider value={result}>
      {children}
    </WindowSizeContext.Provider>
  );
};

export default WindowSizeProvider;

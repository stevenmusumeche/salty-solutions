import React from "react";

const HeaderWrapper: React.FC = ({ children }) => (
  <header className="sticky top-0 py-3 px-2 md:px-0 md:py-4 z-50 bg-gray-700 shadow-lg md:h-20">
    {children}
  </header>
);

export default HeaderWrapper;

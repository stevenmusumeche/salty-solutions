import React from "react";

const HeaderWrapper: React.FC = ({ children }) => (
  <header className="py-3 px-2 md:px-0 md:py-3 z-50 bg-gray-700 shadow-lg">
    {children}
  </header>
);

export default HeaderWrapper;

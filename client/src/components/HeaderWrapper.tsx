import React from "react";

const HeaderWrapper: React.FC = ({ children }) => (
  <header className="sticky top-0 py-4 z-50 bg-gray-700 shadow-lg h-20 hidden md:block">
    {children}
  </header>
);

export default HeaderWrapper;

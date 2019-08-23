import React from "react";

import { Link as ReachLink } from "@reach/router";

const Link: React.FC<any> = ({ children, ...props }) => (
  <ReachLink className="text-blue-600" {...props}>
    {children}
  </ReachLink>
);

export default Link;

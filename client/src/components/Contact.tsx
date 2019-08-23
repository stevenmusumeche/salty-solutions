import React from "react";
import Shell from "./Shell";
import { RouteComponentProps } from "@reach/router";

const Contact: React.FC<RouteComponentProps> = () => (
  <Shell>
    <div className="container mx-auto">
      <div className="forecast-wrapper">
        <h1 className="text-4xl mb-4">Contact</h1>
      </div>
    </div>
  </Shell>
);

export default Contact;

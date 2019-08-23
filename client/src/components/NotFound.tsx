import React from "react";
import Shell from "./Shell";
import Link from "./Link";

const NotFound: React.FC<{ locationSlug: string }> = ({ locationSlug }) => (
  <Shell>
    <div className="container mx-auto">
      <div className="forecast-wrapper">
        <h1 className="text-4xl mb-4">Not Found</h1>
        <p>
          Sorry, but I couldn't find a location for "{locationSlug}." Please{" "}
          <Link to="/">click here</Link> to go to the home page.
        </p>
      </div>
    </div>
  </Shell>
);

export default NotFound;

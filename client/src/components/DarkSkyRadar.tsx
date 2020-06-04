import React from "react";
import useBreakpoints from "../hooks/useBreakpoints";
import { Coords } from "@stevenmusumeche/salty-solutions-shared/dist/graphql";

const DarkSkyRadar: React.FC<{ coords: Coords }> = ({ coords }) => {
  const { isSmall } = useBreakpoints();
  return (
    <div className="mb-4 md:mb-8 bg-white rounded-lg shadow-md md:p-8 inline-flex items-center justify-center w-full">
      <iframe
        title="radar map"
        width="100%"
        height={isSmall ? "450" : "600"}
        src={`https://maps.darksky.net/@radar,${coords.lat},${coords.lon},10`}
        className="md:border border-gray-500"
      ></iframe>
    </div>
  );
};

export default DarkSkyRadar;

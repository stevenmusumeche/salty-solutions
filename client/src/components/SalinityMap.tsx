import React from "react";
import { useSalinityMapQuery, SalinityMapQuery } from "../generated/graphql";
import ErrorIcon from "../assets/error.svg";
import { UseQueryState } from "urql";

interface Props {
  locationId: string;
}

export const SalinityMap: React.FC<Props> = ({ locationId }) => {
  const [salinityMap] = useSalinityMapQuery({ variables: { locationId } });

  function renderMap(salinityMap: UseQueryState<SalinityMapQuery>) {
    if (salinityMap.error)
      return <img src={ErrorIcon} style={{ height: 120 }} alt="error" />;

    if (
      salinityMap.fetching ||
      !salinityMap.data ||
      !salinityMap.data.location
    ) {
      return <div className="text-black">Loading Salinity Map</div>;
    }

    return (
      <img
        src={salinityMap.data.location.salinityMap}
        className="max-h-full"
        alt="salinity map"
      />
    );
  }

  return (
    <>
      <div
        className="mb-8 bg-white rounded-lg shadow-md relative z-0 text-white inline-flex items-start justify-center p-8"
        style={{ width: 800 }}
      >
        {renderMap(salinityMap)}
      </div>
    </>
  );
};

export default SalinityMap;

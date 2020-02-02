import React from "react";
import { useSalinityMapQuery, SalinityMapQuery } from "../generated/graphql";
import ErrorIcon from "../assets/error.svg";
import { UseQueryState } from "urql";
import useBreakpoints from "../hooks/useBreakpoints";

interface Props {
  locationId: string;
}

export const SalinityMap: React.FC<Props> = ({ locationId }) => {
  const [salinityMap, refresh] = useSalinityMapQuery({
    variables: { locationId }
  });

  const { isSmall } = useBreakpoints();

  function renderMap(salinityMap: UseQueryState<SalinityMapQuery>) {
    if (salinityMap.error) {
      return (
        <div className="flex flex-col h-full justify-center items-center">
          <img src={ErrorIcon} style={{ height: 120 }} alt="error" />
          {refresh && (
            <button
              onClick={() => refresh({ requestPolicy: "network-only" })}
              type="button"
              className={"text-black text-sm hover:underline mt-2 mb-1"}
            >
              retry
            </button>
          )}
        </div>
      );
    }

    if (
      salinityMap.fetching ||
      !salinityMap.data ||
      !salinityMap.data.location
    ) {
      return <div className="text-black">Loading Salinity Map</div>;
    }

    const mapUrl = salinityMap.data.location.salinityMap;
    const isPdf = /saveourlake/.test(mapUrl);

    return (
      <ConditionalWrapper
        condition={isSmall}
        wrapper={(children: any) => (
          <a href={mapUrl} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        )}
      >
        {isPdf ? (
          isSmall ? (
            <span className="text-black cursor-pointer underline">
              Open Salinity Map PDF
            </span>
          ) : (
            <embed
              src={mapUrl}
              type="application/pdf"
              width="100%"
              height="900px"
            />
          )
        ) : (
          <img src={mapUrl} className="max-h-full" alt="salinity map" />
        )}
      </ConditionalWrapper>
    );
  }

  return (
    <>
      <div className="mb-8 bg-white rounded-lg shadow-md relative z-0 text-white inline-flex items-start justify-center p-8 salinity-map-wrapper">
        {renderMap(salinityMap)}
      </div>
    </>
  );
};

export default SalinityMap;

const ConditionalWrapper: React.FC<{
  condition: boolean;
  wrapper: any;
}> = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children;

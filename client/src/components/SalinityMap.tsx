import React from "react";
import ErrorIcon from "../assets/error.svg";
import { UseQueryState } from "urql";
import useBreakpoints from "../hooks/useBreakpoints";
import EmptyBox from "./EmptyBox";
import {
  SalinityMapQuery,
  useSalinityMapQuery,
} from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import { useAuth0 } from "@auth0/auth0-react";
import LoginTeaser from "./LoginTeaser";

interface Props {
  locationId: string;
}

export const SalinityMap: React.FC<Props> = ({ locationId }) => {
  const { isAuthenticated } = useAuth0();
  const [salinityMap, refresh] = useSalinityMapQuery({
    variables: { locationId },
    pause: !isAuthenticated,
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
      return <EmptyBox w="100%" h={isSmall ? 140 : 500} />;
    }

    const mapUrl = salinityMap.data.location.salinityMap;

    return (
      <ConditionalWrapper
        condition={isSmall}
        wrapper={(children: any) => (
          <a href={mapUrl} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        )}
      >
        <img src={mapUrl} className="max-h-full" alt="salinity map" />
      </ConditionalWrapper>
    );
  }

  function renderTeaser() {
    return (
      <div className="text-black w-full">
        <div className="text-center text-lg mb-4 font-semibold">
          Find water with ideal salinity
        </div>
        <div className="mb-8 text-left">
          Improve your fishing trips by focusing on areas with ideal salinity.
          When targeting speckled trout or redfish, part of the equation is the
          presence of salty water.
        </div>
        <LoginTeaser message="Login for free to access salinity maps." />
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          minHeight: isAuthenticated ? (isSmall ? 180 : 500) : "none",
          maxWidth: isAuthenticated ? "auto" : 800,
        }}
        className="mb-8 bg-white rounded-lg shadow-md relative z-0 text-white inline-flex items-start justify-center p-8 salinity-map-wrapper"
      >
        {isAuthenticated ? renderMap(salinityMap) : renderTeaser()}
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

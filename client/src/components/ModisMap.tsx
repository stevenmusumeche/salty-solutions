import React, { useState, useEffect } from "react";
import { graphql } from "@stevenmusumeche/salty-solutions-shared";
import ErrorIcon from "../assets/error.svg";
import { UseQueryState } from "urql";
import Magnifier from "react-magnifier";
import { format, differenceInDays } from "date-fns";
import BackIcon from "../assets/back.svg";
import ForwardIcon from "../assets/forward.svg";
import useBreakpoints from "../hooks/useBreakpoints";
import EmptyBox from "./EmptyBox";
import startCase from "lodash/startCase";

interface Props {
  locationId: string;
}

const ModisMap: React.FC<Props> = ({ locationId }) => {
  const { isAtLeastMedium } = useBreakpoints();
  const [modisMap, refresh] = graphql.useModisMapQuery({
    variables: { locationId },
  });
  const [curIndex, setCurIndex] = useState(0);

  // preload the large image
  useEffect(() => {
    if (modisMap && modisMap.data && modisMap.data.location) {
      new Image().src = modisMap.data.location.modisMaps[curIndex].large.url;
    }
  }, [curIndex, modisMap]);

  function renderMap(modisMap: UseQueryState<graphql.ModisMapQuery>) {
    if (modisMap.error)
      return (
        <div className="flex flex-col h-full justify-center items-center">
          <img src={ErrorIcon} style={{ height: 120 }} alt="error" />
          <button
            onClick={() => refresh({ requestPolicy: "network-only" })}
            type="button"
            className={"text-black text-sm hover:underline mt-2 mb-1"}
          >
            retry
          </button>
        </div>
      );

    if (modisMap.fetching || !modisMap.data || !modisMap.data.location) {
      return <EmptyBox w="100%" h={500} />;
    }

    const numMaps = modisMap.data.location.modisMaps.length;
    const curImage = modisMap.data.location.modisMaps[curIndex];
    const dayDiff = differenceInDays(new Date(), new Date(curImage.date));

    const goBack = () => {
      setCurIndex((i) => {
        if (i === numMaps - 1) {
          return 0;
        }
        return i + 1;
      });
    };

    const goForward = () => {
      setCurIndex((i) => {
        if (i === 0) {
          return numMaps - 1;
        }
        return i - 1;
      });
    };

    return (
      <span>
        <p className="mb-4 text-left">
          MODIS is an extensive program using sensors on two satellites that
          each provide complete daily coverage of the earth.{" "}
          {isAtLeastMedium
            ? "Hover over an image to zoom."
            : "Touch and drag the image to zoom."}
        </p>
        <div className="mb-4 flex justify-center items-center">
          <button
            onClick={goBack}
            disabled={curIndex === numMaps - 1}
            className="disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <img src={BackIcon} alt="back" className="h-5" />
          </button>
          <div className="mx-4 w-84 text-lg">
            <div>{format(new Date(curImage.date), "EEEE, LLL d")}</div>
            <div className="text-sm">
              {dayDiff === 0
                ? "Today "
                : `${dayDiff} day${dayDiff > 1 ? "s" : ""} ago `}
              ({startCase(curImage.satellite.toLowerCase())} Satellite)
            </div>
          </div>
          <button
            onClick={goForward}
            disabled={curIndex === 0}
            className="disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <img src={ForwardIcon} alt="forward" className="h-5" />
          </button>
        </div>
        <div style={{ minHeight: isAtLeastMedium ? 800 : 300 }}>
          <Magnifier
            className={"magnifier-image-mobile"}
            src={curImage.small.url}
            zoomImgSrc={curImage.large.url}
            zoomFactor={5}
            mgWidth={isAtLeastMedium ? 400 : window.innerWidth - 120}
            mgHeight={isAtLeastMedium ? 275 : 200}
            mgShape="square"
          />
        </div>
      </span>
    );
  }

  return (
    <>
      <div className="mb-8 bg-white rounded-lg shadow-md z-0 text-white p-8 inline-flex items-center justify-center text-gray-900 text-center w-full md:w-200">
        {renderMap(modisMap)}
      </div>
    </>
  );
};

export default ModisMap;

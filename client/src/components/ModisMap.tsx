import React, { useState } from "react";
import { useModisMapQuery, ModisMapQuery } from "../generated/graphql";
import ErrorIcon from "../assets/error.svg";
import { UseQueryState } from "urql";
import Magnifier from "react-magnifier";
import { format } from "date-fns";
import BackIcon from "../assets/back.svg";
import ForwardIcon from "../assets/forward.svg";

interface Props {
  locationId: string;
}

const ModisMap: React.FC<Props> = ({ locationId }) => {
  const [modisMap] = useModisMapQuery({ variables: { locationId } });
  const [curIndex, setCurIndex] = useState(0);

  function renderMap(modisMap: UseQueryState<ModisMapQuery>) {
    if (modisMap.error)
      return <img src={ErrorIcon} style={{ height: 120 }} alt="error" />;

    if (modisMap.fetching || !modisMap.data || !modisMap.data.location) {
      return <div className="text-black">Loading Satellite Map</div>;
    }

    const numMaps = modisMap.data.location.modisMaps.length;
    const curImage = modisMap.data.location.modisMaps[curIndex];

    const goBack = () => {
      setCurIndex(i => {
        if (i === numMaps - 1) {
          return 0;
        }
        return i + 1;
      });
    };

    const goForward = () => {
      setCurIndex(i => {
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
          each provide complete daily coverage of the earth.
        </p>
        <div className="mb-4 flex justify-center items-center">
          <button
            onClick={goBack}
            disabled={curIndex === numMaps - 1}
            className="disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <img src={BackIcon} alt="back" className="h-5" />
          </button>
          <div className="mx-4 w-48">
            {format(new Date(curImage.date), "EEEE, LLL d")}
          </div>
          <button
            onClick={goForward}
            disabled={curIndex === 0}
            className="disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <img src={ForwardIcon} alt="forward" className="h-5" />
          </button>
        </div>
        <Magnifier
          src={curImage.small.url}
          width={curImage.small.width}
          zoomImgSrc={curImage.large.url}
          zoomFactor={5}
          mgWidth={400}
          mgHeight={275}
          mgShape="square"
        />
      </span>
    );
  }

  return (
    <>
      <div
        className="mb-8 bg-white rounded-lg shadow-md z-0 text-white p-8 inline-flex items-center justify-center text-gray-900 text-center"
        style={{ width: 750 }}
      >
        {renderMap(modisMap)}
      </div>
    </>
  );
};

export default ModisMap;

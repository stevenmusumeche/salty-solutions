import React, { useEffect, useRef, ReactElement } from "react";
import PlayIcon from "../assets/play.svg";
import StopIcon from "../assets/stop.svg";
import { format } from "date-fns";
import ErrorIcon from "../assets/error.svg";
import {
  OverlayMapsFragment,
  useMapsQuery,
  Maybe,
  Map,
} from "@stevenmusumeche/salty-solutions-shared/dist/graphql";

interface Props {
  locationId: string;
}

export const RadarMap: React.FC<Props> = ({ locationId }) => {
  const [tick, setTick] = React.useState(0);
  const [animated, setAnimated] = React.useState(false);

  let overlays: Maybe<OverlayMapsFragment> = null;
  let radar: Map[] = [];

  const [maps, refresh] = useMapsQuery({ variables: { locationId } });

  if (maps.data && maps.data.location && maps.data.location.maps) {
    overlays =
      maps.data &&
      maps.data.location &&
      maps.data.location.maps &&
      maps.data.location.maps.overlays;

    radar = maps.data.location.maps.radar;
  }

  const timer = useRef<NodeJS.Timeout>();
  useEffect(() => {
    if (animated) {
      const ticker = () => {
        timer.current = setInterval(() => {
          setTick((x) => {
            const isLastImage = x % radar.length === radar.length - 1;
            if (isLastImage && timer.current) {
              cleanup();
              // show most recent image for 3 seconds, then start the loop over
              setTimeout(() => {
                setTick(0);
                ticker();
              }, 3000);
              return x;
            }

            return ++x;
          });
        }, 750);
      };

      ticker();
    } else {
      setTick(0);
    }

    const cleanup = () => {
      if (timer.current) clearInterval(timer.current);
    };

    return cleanup;
  }, [animated, timer, radar]);

  const currentImageIndex = animated ? tick % radar.length : 0;
  const animationPercent = Math.round(
    (currentImageIndex / (radar.length - 1)) * 100
  );

  return (
    <>
      <div className="mb-8 bg-black relative z-0 text-white radar-wrapper">
        {maps.fetching && (
          <div className="flex items-center justify-center h-full">
            Loading Maps
          </div>
        )}

        {maps.error && (
          <div className="flex flex-col h-full justify-center items-center">
            <img src={ErrorIcon} style={{ height: 120 }} alt="error" />
            {refresh && (
              <button
                onClick={() => refresh({ requestPolicy: "network-only" })}
                type="button"
                className={"text-white text-sm hover:underline mt-2 mb-1"}
              >
                retry
              </button>
            )}
          </div>
        )}

        {/* base overlay maps */}
        {overlays && <OverlayMaps overlays={overlays} />}

        {/* most recent image for non-animated */}
        {radar.length > 0 && (
          <img
            src={radar[radar.length - 1].imageUrl}
            className={`absolute inset-0 z-20 ${animated && "hidden"}`}
            alt="radar map"
          />
        )}

        {/* images for animation */}
        {radar.map((map, i) => (
          <img
            src={map.imageUrl}
            key={i}
            className={`absolute inset-0 z-20 ${i !== currentImageIndex &&
              "hidden"}`}
            alt="radar map"
          />
        ))}

        {radar.length ? (
          <BottomBar>
            <>
              {/* play/stop button */}
              <div className="mr-5 w-5 flex">
                <button
                  className="w-full"
                  onClick={() => setAnimated((x) => !x)}
                >
                  <img
                    src={animated ? StopIcon : PlayIcon}
                    alt="animation controls"
                  />
                </button>
              </div>
              {/* progress bar */}
              <div className="w-full relative flex items-center">
                <div
                  className="h-1 w-full bg-gray-600 shadow-md"
                  style={{ height: 1 }}
                />
                <div
                  className="w-3 h-3 bg-gray-300 rounded-full absolute animated-ticker"
                  style={{ left: `calc(${animationPercent}% - 6px)` }}
                />
              </div>
              {/* timestamp for current image */}
              <div className="text-right w-24 text-gray-300">
                {format(
                  new Date(
                    animated
                      ? radar[currentImageIndex].timestamp
                      : radar[radar.length - 1].timestamp
                  ),
                  "h:mmaaa"
                ).toLowerCase()}
              </div>
            </>
          </BottomBar>
        ) : (
          <BottomBar justifyBetween={false}>
            <div>{format(new Date(), "h:mmaaa").toLowerCase()}</div>
          </BottomBar>
        )}
      </div>
    </>
  );
};

export default RadarMap;

const OverlayMaps: React.FC<{ overlays: OverlayMapsFragment }> = ({
  overlays,
}) => {
  return (
    <>
      {overlays.topo && (
        <img
          src={overlays.topo}
          className="absolute inset-0 z-10"
          alt="radar map"
        />
      )}
      {overlays.rivers && (
        <img
          src={overlays.rivers}
          className="absolute inset-0 z-10"
          alt="radar map"
        />
      )}
      {overlays.counties && (
        <img
          src={overlays.counties}
          className="absolute inset-0 z-10"
          alt="radar map"
        />
      )}
      {overlays.highways && (
        <img
          src={overlays.highways}
          className="absolute inset-0 z-10"
          alt="radar map"
        />
      )}
      {overlays.cities && (
        <img
          src={overlays.cities}
          className="absolute inset-0 z-10"
          alt="radar map"
        />
      )}
    </>
  );
};

const BottomBar: React.FC<{
  children: ReactElement;
  justifyBetween?: boolean;
}> = ({ children, justifyBetween = true }) => (
  <div
    className={`absolute bottom-0 inset-x-0 bg-gray-900 text-white px-4 py-2 z-30 flex ${
      justifyBetween ? "justify-between" : "justify-end"
    }`}
  >
    {children}
  </div>
);

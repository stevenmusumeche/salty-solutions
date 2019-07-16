import React, { useEffect, useRef } from "react";
import {
  useMapsQuery,
  OverlayMapsFragment,
  Maybe,
  Map
} from "../generated/graphql";
import { format } from "date-fns";

interface Props {
  locationId: string;
  animated?: boolean;
}

export const RadarMap: React.FC<Props> = ({ locationId, animated = true }) => {
  const [tick, setTick] = React.useState(0);

  let overlays: Maybe<OverlayMapsFragment> = null;
  let radar: Map[] = [];

  const [maps] = useMapsQuery({ variables: { locationId } });

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
      console.log("start ticking");

      timer.current = setInterval(() => {
        setTick(x => ++x);
      }, 750);
    } else {
      console.log("not animated, do nothing");
      setTick(0);
    }

    const cleanup = () => {
      console.log("cleanup");

      if (timer.current) clearInterval(timer.current);
    };

    return cleanup;
  }, [animated, timer, radar]);

  const currentImageIndex = animated ? tick % radar.length : 0;

  return (
    <>
      <div
        className="mb-8 bg-black relative z-0"
        style={{ width: 600, height: 550 }}
      >
        {/* base overlay maps */}
        {overlays && <OverlayMaps overlays={overlays} />}

        {/* images for animation */}
        {radar.map((map, i) => (
          <img
            src={map.imageUrl}
            key={i}
            className={`absolute inset-0 z-20 ${i !== currentImageIndex &&
              "hidden"}`}
          />
        ))}

        {/* most recent image for non-animated */}
        {radar.length && (
          <img
            src={radar[radar.length - 1].imageUrl}
            className={`absolute inset-0 z-20 ${animated && "hidden"}`}
          />
        )}

        {/* timestamp for current image */}
        {radar.length && (
          <div className="absolute bottom-0 inset-x-0 bg-gray-900 text-white px-4 py-2 z-30 flex justify-between">
            <div className="bg-red-500">
              {/* todo: display animation in process */}
              animation stuff
            </div>
            <div className="text-right">
              {format(
                new Date(
                  animated
                    ? radar[currentImageIndex].timestamp
                    : radar[radar.length - 1].timestamp
                ),
                "h:mmaaa"
              ).toLowerCase()}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RadarMap;

const OverlayMaps: React.FC<{ overlays: OverlayMapsFragment }> = ({
  overlays
}) => {
  return (
    <>
      {overlays.topo && (
        <img src={overlays.topo} className="absolute inset-0 z-10" />
      )}
      {overlays.rivers && (
        <img src={overlays.rivers} className="absolute inset-0 z-10" />
      )}
      {overlays.counties && (
        <img src={overlays.counties} className="absolute inset-0 z-10" />
      )}
      {overlays.highways && (
        <img src={overlays.highways} className="absolute inset-0 z-10" />
      )}
      {overlays.cities && (
        <img src={overlays.cities} className="absolute inset-0 z-10" />
      )}
    </>
  );
};

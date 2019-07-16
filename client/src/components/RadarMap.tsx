import React, { useEffect, useRef } from "react";
import { useMapsQuery, OverlayMapsFragment, Maybe } from "../generated/graphql";

// function useInterval(callback: Function, delay: number, onCancel: Function) {
//   const savedCallback = useRef<Function>();

//   // Remember the latest callback.
//   useEffect(() => {
//     savedCallback.current = callback;
//   }, [callback]);

//   // Set up the interval.
//   useEffect(() => {
//     function tick() {
//       if (savedCallback.current) savedCallback.current();
//     }
//     if (delay !== null) {
//       let id = setInterval(tick, delay);
//       return () => {
//         onCancel();
//         clearInterval(id);
//       };
//     }
//   }, [delay]);
// }

interface Props {
  locationId: string;
  animated?: boolean;
}

export const RadarMap: React.FC<Props> = ({ locationId, animated = true }) => {
  const [tick, setTick] = React.useState(0);
  const [currentMap, setCurrentMap] = React.useState("");

  let overlays: Maybe<OverlayMapsFragment> = null;
  let radar: string[] = [];

  const [maps] = useMapsQuery({ variables: { locationId } });

  if (maps.data && maps.data.location && maps.data.location.maps) {
    overlays =
      maps.data &&
      maps.data.location &&
      maps.data.location.maps &&
      maps.data.location.maps.overlays;

    radar = maps.data.location.maps.radar.map(x => x.imageUrl);
    if (!currentMap) setCurrentMap(radar[radar.length - 2]);
  }

  // useInterval(
  //   () => {
  //     if (radar.length) {
  //       if (animate) {
  //         setCurrentRadar(radar[mapNum % radar.length]);
  //         setMapNum(x => ++x);
  //       } else {
  //         setCurrentRadar(radar[0]);
  //       }
  //     }
  //   },
  //   1000,
  //   () => setCurrentRadar(radar[0])
  // );

  let timer = React.useRef<NodeJS.Timeout>();

  // todo: fix
  useEffect(() => {
    if (animated) {
      timer.current = setInterval(() => {
        console.log("tick", radar[tick % radar.length]);
        setCurrentMap(radar[tick % radar.length]);
        setTick(x => x + 1);
      }, 1000);
    } else {
      console.log("not animated, do nothing");
    }

    const cleanup = () => {
      console.log("cleanup");
      setCurrentMap(radar[radar.length - 2]);

      if (timer.current) clearInterval(timer.current);
    };

    return cleanup;
  }, [animated]);

  return (
    <>
      {/* <button
        className="bg-blue-500 text-white"
        onClick={() => {
          setAnimate(x => !x);
        }}
      >
        animate
      </button> */}
      <div
        className="mb-8 bg-black relative z-0"
        style={{ width: 600, height: 550 }}
      >
        {overlays && <OverlayMaps overlays={overlays} />}
        {currentMap && (
          <img src={currentMap} className="absolute inset-0 z-20" />
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

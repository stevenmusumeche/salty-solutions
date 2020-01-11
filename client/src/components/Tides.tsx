import React, {
  useState,
  ChangeEventHandler,
  useEffect,
  useContext
} from "react";
import {
  TideStationDetailFragment,
  useTideQuery,
  TideDetail,
  TideDetailFieldsFragment,
  SunDetailFieldsFragment
} from "../generated/graphql";
import {
  startOfDay,
  format,
  addHours,
  isBefore,
  addMinutes,
  subMinutes,
  isAfter,
  addDays
} from "date-fns";
import {
  VictoryChart,
  VictoryAxis,
  VictoryArea,
  VictoryScatter,
  VictoryLine
} from "victory";
import ErrorIcon from "../assets/error.svg";
import "./SkeletonCharacter.css";
import { WindowSizeContext } from "../providers/WindowSizeProvider";

interface Props {
  tideStations: TideStationDetailFragment[];
  locationId: string;
  date: Date;
}

const ISO_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx";
const Y_PADDING = 0.3;

const Tides: React.FC<Props> = ({ tideStations, locationId, date }) => {
  const [selectedId, setSelectedId] = useState(tideStations[0].id);
  const { isSmall } = useContext(WindowSizeContext);

  useEffect(() => {
    // if locationId changes, set tide station back to the default
    setSelectedId(tideStations[0].id);
  }, [locationId, tideStations]);

  const [tideResult, refresh] = useTideQuery({
    variables: {
      locationId,
      stationId: selectedId!,
      startDate: format(startOfDay(date), ISO_FORMAT),
      endDate: format(addDays(startOfDay(date), 1), ISO_FORMAT)
    },
    pause: selectedId === undefined
  });

  const handleStationChange: ChangeEventHandler<HTMLSelectElement> = e =>
    setSelectedId(e.target.value);

  if (tideResult.fetching) {
    return (
      <div>
        <div className="">
          <TideStationSelect
            tideStations={tideStations}
            handleChange={handleStationChange}
            selectedId={selectedId}
          />
        </div>
        <div className="skeleton-character full" />
      </div>
    );
  } else if (
    !tideResult.data ||
    !tideResult.data.tidePreditionStation ||
    !tideResult.data.tidePreditionStation.tides ||
    !tideResult.data.location ||
    !tideResult.data.location.sun
  ) {
    return (
      <>
        <div className="">
          <TideStationSelect
            tideStations={tideStations}
            handleChange={handleStationChange}
            selectedId={selectedId}
          />
        </div>
        <div className="relative w-full flex items-center justify-center py-8 flex-col">
          <img src={ErrorIcon} style={{ height: 120 }} alt="error" />
          <button
            onClick={() => refresh({ requestPolicy: "network-only" })}
            type="button"
            className={"text-black text-sm hover:underline mt-2 mb-1"}
          >
            retry
          </button>
        </div>
      </>
    );
  }

  // we get an array of sun data with the various dates. use the one that matches the selected date
  const sunData = tideResult.data.location.sun.filter(
    x =>
      startOfDay(new Date(x.sunrise)).toISOString() ===
      startOfDay(date).toISOString()
  )[0];

  const {
    dawn,
    dusk,
    darkEvening,
    darkMorning,
    daylight,
    tideData,
    hiLowData
  } = buildDatasets(sunData, tideResult.data.tidePreditionStation.tides);

  let tickValues = [];
  for (let i = 0; i <= 24; i += isSmall ? 4 : 2) {
    tickValues.push(addHours(startOfDay(date), i));
  }

  const { min } = calcTideBoundaries(
    tideResult.data.tidePreditionStation.tides
  );

  return (
    <>
      <div className="">
        <TideStationSelect
          tideStations={tideStations}
          handleChange={handleStationChange}
          selectedId={selectedId}
        />
      </div>
      <VictoryChart
        width={450}
        height={250}
        style={{ parent: { backgroundColor: "white", touchAction: "auto" } }}
        padding={{
          top: 10,
          bottom: 30,
          left: isSmall ? 50 : 30,
          right: isSmall ? 30 : 10
        }}
      >
        {/* background colors for time periods like night, dusk, etc */}
        {renderBackgroundColor(darkMorning, "#4a5568", min)}
        {renderBackgroundColor(darkEvening, "#4a5568", min)}
        {renderBackgroundColor(daylight, "#ebf8ff", min)}
        {renderBackgroundColor(dawn, "#a0aec0", min)}
        {renderBackgroundColor(dusk, "#a0aec0", min)}

        {/* time x-axis */}
        <VictoryAxis
          style={{
            grid: {
              strokeWidth: isSmall ? 1 : 1,
              stroke: "#718096",
              strokeDasharray: isSmall ? "2 4" : "2 10"
            },
            tickLabels: { fontSize: isSmall ? 20 : 8 }
          }}
          tickFormat={date => format(new Date(date), "ha").toLowerCase()}
          tickValues={tickValues}
          offsetY={30}
        />
        {/* tide height y-axis */}
        <VictoryAxis
          dependentAxis
          style={{
            grid: {
              stroke: "718096",
              strokeWidth: y => (isSmall ? 0 : y === 0 && min < 0 ? 2 : 1),
              strokeDasharray: y => (y === 0 && min < 0 ? "12 6" : "2 10")
            },
            tickLabels: { fontSize: isSmall ? 20 : 8 }
          }}
          tickCount={isSmall ? 6 : 10}
          crossAxis={false}
        />
        {/* actual tide line */}
        <VictoryLine
          data={tideData}
          scale={{ x: "time", y: "linear" }}
          interpolation={"natural"}
          style={{
            data: {
              strokeWidth: 1,
              stroke: "black"
            }
          }}
        />
        {/* hi and low tide labels */}
        {!isSmall && (
          <VictoryScatter
            data={hiLowData}
            size={1.5}
            labels={data =>
              format(new Date(data.x), "h:mma") + `\n${data.y.toFixed(1)}ft`
            }
            style={{
              data: {
                fill: "transparent"
              },
              labels: {
                fontSize: 8,
                padding: 2,
                fill: datum => {
                  const isNight =
                    isAfter(datum.x, new Date(sunData.nauticalDusk)) ||
                    isBefore(datum.x, new Date(sunData.nauticalDawn));

                  return isNight ? "#a0aec0" : "#000000";
                },
                textShadow: datum => {
                  const isNight =
                    isAfter(datum.x, new Date(sunData.nauticalDusk)) ||
                    isBefore(datum.x, new Date(sunData.nauticalDawn));

                  return isNight ? "0 0 5px #000000" : "0 0 5px #ffffff";
                }
              }
            }}
          />
        )}
      </VictoryChart>
      <div
        className="md:hidden mt-8"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {hiLowData.map(({ x, y, type }, i) => (
          <div
            key={i}
            className="py-1"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 2fr",
              gridColumnGap: "1rem",
              backgroundColor: i % 2 === 0 ? "#edf2f7" : "white"
            }}
          >
            <div className="text-right">{format(new Date(x), "h:mma")}</div>
            <div>{type} tide</div>
            <div>{y.toFixed(1)} feet</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Tides;

const TideStationSelect: React.FC<{
  tideStations: TideStationDetailFragment[];
  handleChange: ChangeEventHandler<HTMLSelectElement>;
  selectedId: string;
}> = ({ tideStations, handleChange, selectedId }) => (
  <div className="py-2">
    <div className="mr-2 inline-block uppercase leading-loose text-gray-700 text-sm">
      Tide Station:
    </div>
    <div className="inline-block rounded border-gray-300 border">
      <select
        onChange={handleChange}
        value={selectedId}
        className="select-css pr-8 pl-2 py-1 bg-white text-gray-700 text-sm"
      >
        {tideStations.map(station => (
          <option key={station.id} value={station.id}>
            {station.name}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const renderBackgroundColor = (
  data: any[],
  color: string,
  minValue: number
) => {
  return (
    <VictoryArea
      data={data}
      scale={{ x: "time", y: "linear" }}
      style={{
        data: {
          strokeWidth: 0,
          fill: color
        }
      }}
      y0={() => (minValue < 0 ? minValue - Y_PADDING : 0)}
    />
  );
};

// used to select the timespans corresponding to a certain group, like dusk, dawn, etc
const makeTimespanFilterer = (
  tides: TideDetailFieldsFragment[],
  maxValue: number
) => (filterFn: (tide: TideDetailFieldsFragment) => boolean) => {
  return tides.filter(filterFn).map(tide => ({
    x: new Date(tide.time),
    y: maxValue
  }));
};

const buildDatasets = (
  sunData: SunDetailFieldsFragment,
  tideDetails: TideDetailFieldsFragment[]
) => {
  const sunrise = new Date(sunData.sunrise);
  const sunset = new Date(sunData.sunset);
  const nauticalDusk = new Date(sunData.nauticalDusk);
  const nauticalDawn = new Date(sunData.nauticalDawn);
  type Filterer = (tide: TideDetailFieldsFragment) => boolean;
  const isDarkMorning: Filterer = tide =>
    isBefore(new Date(tide.time), addMinutes(nauticalDawn, 10));
  const isDarkEvening: Filterer = tide =>
    isAfter(new Date(tide.time), subMinutes(nauticalDusk, 10));
  const isDawn: Filterer = tide =>
    isBefore(new Date(tide.time), sunrise) &&
    isAfter(new Date(tide.time), nauticalDawn);
  const isDusk: Filterer = tide =>
    isAfter(new Date(tide.time), sunset) &&
    isBefore(new Date(tide.time), nauticalDusk);
  const isDaylight: Filterer = tide =>
    isAfter(new Date(tide.time), subMinutes(sunrise, 6)) &&
    isBefore(new Date(tide.time), addMinutes(sunset, 6));

  const tideBoundaries = calcTideBoundaries(tideDetails);

  const timespanFilterer = makeTimespanFilterer(
    tideDetails,
    tideBoundaries.max + Y_PADDING
  );

  const toVictory = (tide: TideDetail) => ({
    x: new Date(tide.time),
    y: tide.height,
    type: tide.type
  });

  const tideData = tideDetails.map(toVictory);
  const hiLowData = tideDetails
    .filter(tide => tide.type !== "intermediate")
    .map(toVictory);

  const darkMorning = timespanFilterer(isDarkMorning);
  const darkEvening = timespanFilterer(isDarkEvening);
  const dawn = timespanFilterer(isDawn);
  const dusk = timespanFilterer(isDusk);
  const daylight = timespanFilterer(isDaylight);

  return {
    darkMorning,
    darkEvening,
    dawn,
    dusk,
    daylight,
    tideData,
    hiLowData
  };
};

function calcTideBoundaries(tideDetails: TideDetailFieldsFragment[]) {
  return tideDetails.reduce(
    (cur, tide) => {
      return {
        max: cur.max > tide.height ? cur.max : tide.height,
        min: cur.min < tide.height ? cur.min : tide.height
      };
    },
    { max: 0, min: 0 }
  );
}

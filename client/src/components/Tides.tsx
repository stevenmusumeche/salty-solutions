import React, { useState, ChangeEventHandler, useEffect } from "react";
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

interface Props {
  tideStations: TideStationDetailFragment[];
  locationId: string;
}

const ISO_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx";

const Tides: React.FC<Props> = ({ tideStations, locationId }) => {
  const [selectedId, setSelectedId] = useState(tideStations[0].id);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    // if locationId changes, set tide station back to the default
    setSelectedId(tideStations[0].id);
  }, [locationId, tideStations]);

  const [tideResult] = useTideQuery({
    variables: {
      locationId,
      stationId: selectedId!,
      startDate: format(startOfDay(date), ISO_FORMAT),
      endDate: format(addDays(startOfDay(date), 1), ISO_FORMAT)
    },
    pause: selectedId === undefined
  });

  if (tideResult.fetching)
    // todo: loading screen
    return <div style={{ width: 1280, height: 711 }}>fetching</div>;
  if (
    !tideResult.data ||
    !tideResult.data.tidePreditionStation ||
    !tideResult.data.tidePreditionStation.tides ||
    !tideResult.data.location ||
    !tideResult.data.location.sun
  )
    // todo: what to do here?
    return <div>no data</div>;

  const {
    dawn,
    dusk,
    darkEvening,
    darkMorning,
    daylight,
    tideData,
    hiLowData
  } = buildDatasets(
    tideResult.data.location.sun[tideResult.data.location.sun.length - 1],
    tideResult.data.tidePreditionStation.tides
  );

  const handleStationChange: ChangeEventHandler<HTMLSelectElement> = e =>
    setSelectedId(e.target.value);

  let tickValues = [];
  for (let i = 0; i <= 24; i += 2) {
    tickValues.push(addHours(startOfDay(new Date()), i));
  }

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
        domainPadding={{ y: [10, 0], x: 0 }}
        width={450}
        height={250}
        style={{ parent: { backgroundColor: "white" } }}
        padding={{ top: 10, bottom: 30, left: 30, right: 10 }}
      >
        {/* background colors for time periods like night, dusk, etc */}
        {renderBackgroundColor(darkMorning, "#4a5568")}
        {renderBackgroundColor(darkEvening, "#4a5568")}
        {renderBackgroundColor(daylight, "#ebf8ff")}
        {renderBackgroundColor(dawn, "#a0aec0")}
        {renderBackgroundColor(dusk, "#a0aec0")}

        {/* time x-axis */}
        <VictoryAxis
          style={{
            grid: { stroke: "#718096", strokeDasharray: "2 10" },
            tickLabels: { fontSize: 8 }
          }}
          tickFormat={date => format(new Date(date), "ha").toLowerCase()}
          tickValues={tickValues}
          offsetY={30}
        />
        {/* tide height y-axis */}
        <VictoryAxis
          dependentAxis
          style={{
            grid: { stroke: "#718096", strokeDasharray: "2 10" },
            tickLabels: { fontSize: 8 }
          }}
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
        <VictoryScatter
          data={hiLowData}
          size={1.5}
          labels={data => format(new Date(data.x), "h:mma")}
          style={{
            data: {
              fill: "transparent"
            },
            labels: {
              fontSize: 6,
              padding: 2,
              fill: "#000000"
            }
          }}
        />
      </VictoryChart>
    </>
  );
};

export default Tides;

const TideStationSelect: React.FC<{
  tideStations: TideStationDetailFragment[];
  handleChange: ChangeEventHandler<HTMLSelectElement>;
  selectedId: string;
}> = ({ tideStations, handleChange, selectedId }) => (
  <select onChange={handleChange} value={selectedId} className="">
    {tideStations.map(station => (
      <option key={station.id} value={station.id}>
        {station.name}
      </option>
    ))}
  </select>
);

const renderBackgroundColor = (data: any[], color: string) => {
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

  const maxTide = tideDetails.reduce((curMax, tide) => {
    return curMax > tide.height ? curMax : tide.height;
  }, 0);

  const timespanFilterer = makeTimespanFilterer(tideDetails, maxTide + 0.2);

  const toVictory = (tide: TideDetail) => ({
    x: new Date(tide.time),
    y: tide.height
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

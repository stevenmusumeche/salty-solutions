import React, {
  useState,
  ChangeEventHandler,
  useEffect,
  useContext
} from "react";
import {
  TideStationDetailFragment,
  useTideQuery,
  UsgsSiteDetailFragment
} from "../generated/graphql";
import {
  startOfDay,
  format,
  addHours,
  subDays,
  addDays,
  isSameDay
} from "date-fns";
import ErrorIcon from "../assets/error.svg";
import UsgsSiteSelect from "./UsgsSiteSelect";
import EmptyBox from "./EmptyBox";
import { buildDatasets } from "./tide/tide-helpers";
import MainTideChart from "./MainTideChart";
import MultiDayTideCharts from "./MultiDayTideCharts";
import useBreakpoints from "../hooks/useBreakpoints";

interface Props {
  tideStations: TideStationDetailFragment[];
  usgsSites: UsgsSiteDetailFragment[];
  locationId: string;
  date: Date;
  setActiveDate: (date: Date) => void;
}

const ISO_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx";

const Tides: React.FC<Props> = ({
  tideStations,
  usgsSites,
  locationId,
  date,
  setActiveDate
}) => {
  const [selectedTideStationId, setSelectedTideStationId] = useState(
    tideStations[0].id
  );
  const [selectedUsgsSiteId, setSelectedUsgsSiteId] = useState(usgsSites[0].id);
  const { isSmall } = useBreakpoints();

  useEffect(() => {
    // if locationId changes, set tide station back to the default
    setSelectedTideStationId(tideStations[0].id);
    setSelectedUsgsSiteId(usgsSites[0].id);
  }, [locationId, tideStations, usgsSites]);

  const [tideResult, refresh] = useTideQuery({
    variables: {
      locationId,
      tideStationId: selectedTideStationId!,
      usgsSiteId: selectedUsgsSiteId!,
      startDate: format(subDays(startOfDay(date), 3), ISO_FORMAT),
      endDate: format(addDays(startOfDay(date), 4), ISO_FORMAT)
    },
    pause: selectedTideStationId === undefined
  });

  const handleStationChange: ChangeEventHandler<HTMLSelectElement> = e =>
    setSelectedTideStationId(e.target.value);

  const handleUsgsSiteChange: ChangeEventHandler<HTMLSelectElement> = e =>
    setSelectedUsgsSiteId(e.target.value);

  if (tideResult.fetching) {
    return (
      <div>
        <div className="my-4 mb-4 md:flex md:items-center">
          <EmptyBox
            h={isSmall ? "3.2rem" : "2.2rem"}
            w={isSmall ? "100%" : "20rem"}
            className="mr-8 mb-4 md:mb-0"
          />
          <EmptyBox
            h={isSmall ? "3.2rem" : "2.2rem"}
            w={isSmall ? "100%" : "24rem"}
            className="m-0"
          />
        </div>
        <div className="my-4 mb-4 flex justify-center">
          <EmptyBox h="2.5rem" w="7rem" className="mr-2" />
          <EmptyBox h="2.5rem" w="7rem" className="" />
        </div>
        <EmptyBox h={isSmall ? 190 : 500} w="100%" className="mb-4 md:mb:0" />
        <EmptyBox h={isSmall ? 100 : 200} w="100%" className="" />
      </div>
    );
  } else if (
    !tideResult.data ||
    !tideResult.data.tidePreditionStation ||
    !tideResult.data.tidePreditionStation.tides ||
    !tideResult.data.location ||
    !tideResult.data.location.sun ||
    !tideResult.data.usgsSite ||
    !tideResult.data.usgsSite.waterHeight
  ) {
    return (
      <>
        <div className="">
          <TideStationSelect
            tideStations={tideStations}
            handleChange={handleStationChange}
            selectedId={selectedTideStationId}
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

  // filter data for current date
  const sunData = tideResult.data.location.sun.filter(
    x =>
      startOfDay(new Date(x.sunrise)).toISOString() ===
      startOfDay(date).toISOString()
  )[0];

  const curDayWaterHeight = tideResult.data.usgsSite.waterHeight.filter(x => {
    return isSameDay(new Date(x.timestamp), date);
  });

  const curDayTides = tideResult.data.tidePreditionStation.tides.filter(x =>
    isSameDay(new Date(x.time), date)
  );

  const { hiLowData, tideBoundaries } = buildDatasets(
    sunData,
    curDayTides,
    curDayWaterHeight
  );

  let tickValues = [];
  for (let i = 0; i <= 24; i += isSmall ? 4 : 2) {
    tickValues.push(addHours(startOfDay(date), i));
  }

  const { min } = tideBoundaries;
  return (
    <>
      <div className="md:flex">
        <div>
          <TideStationSelect
            tideStations={tideStations}
            handleChange={handleStationChange}
            selectedId={selectedTideStationId}
          />
        </div>
        <div className="md:ml-4 mb-4">
          <UsgsSiteSelect
            sites={usgsSites}
            handleChange={handleUsgsSiteChange}
            selectedId={selectedUsgsSiteId}
            label="Observation Site:"
          />
        </div>
      </div>
      <HighLowTable hiLowData={hiLowData} />
      <MainTideChart
        sunData={sunData}
        tideData={curDayTides}
        waterHeightData={curDayWaterHeight}
        date={date}
      />
      <MultiDayTideCharts
        sunData={tideResult.data.location.sun}
        tideData={tideResult.data.tidePreditionStation.tides}
        waterHeightData={tideResult.data.usgsSite.waterHeight}
        activeDate={date}
        setActiveDate={setActiveDate}
        numDays={isSmall ? 3 : 7}
      />
      <div className="items-center justify-center flex mt-4">
        <div className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-2 rounded-sm bg-black flex-shrink-0"></div>
        <div className="uppercase text-gray-700 text-sm">Predicted</div>
        <div className="w-4 h-4 md:w-6 md:h-6 md:ml-4 ml-2 mr-1 md:mr-2 rounded-sm bg-blue-600 flex-shrink-0"></div>
        <div className="uppercase text-gray-700 text-sm">Observed</div>
      </div>
    </>
  );
};

export default Tides;

const HighLowTable: React.FC<{ hiLowData: any[] }> = ({ hiLowData }) => (
  <div
    className="mb-4 md:mb-2 text-gray-700 text-sm flex flex-wrap items-center justify-center"
    style={{ fontVariantNumeric: "tabular-nums" }}
  >
    {hiLowData.map(({ x, y, type }, i) => (
      <div
        key={i}
        className="flex items-stretch mr-2 last:mr-0 border border-yellow-700 rounded mb-2 md:mb-0"
        style={{ flexBasis: "1" }}
      >
        <div
          className="w-10 bg-yellow-700 text-white flex items-center justify-center uppercase"
          style={{ fontSize: ".7rem" }}
        >
          {type}
        </div>
        <div className="px-2">{format(new Date(x), "h:mma").toLowerCase()}</div>
      </div>
    ))}
  </div>
);

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

import {
  addDays,
  addHours,
  format,
  startOfDay,
  subDays,
  isWithinInterval,
} from "date-fns";
import React, { ChangeEventHandler, useEffect, useState } from "react";
import ErrorIcon from "../../assets/error.svg";
import useBreakpoints from "../../hooks/useBreakpoints";
import EmptyBox from "../EmptyBox";
import MainTideChart from "./MainTideChart";
import MultiDayTideCharts from "./MultiDayTideCharts";
import UsgsSiteSelect from "../UsgsSiteSelect";
import MoonPhase from "../MoonPhase";
import DatePicker from "react-date-picker";
import { buildDatasets } from "@stevenmusumeche/salty-solutions-shared/dist/tide-helpers";
import {
  TideStationDetailFragment,
  UsgsSiteDetailFragment,
  useTideQuery,
  SunDetailFieldsFragment,
  MoonDetailFieldsFragment,
  SolunarDetailFieldsFragment,
  SolunarPeriodFieldsFragment,
} from "@stevenmusumeche/salty-solutions-shared/dist/graphql";

interface Props {
  tideStations: TideStationDetailFragment[];
  sites: Array<UsgsSiteDetailFragment | TideStationDetailFragment>;
  locationId: string;
  date: Date;
  setActiveDate: (date: Date | Date[]) => void;
}

export const ISO_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx";

const Tides: React.FC<Props> = ({
  tideStations,
  sites,
  locationId,
  date,
  setActiveDate,
}) => {
  const [selectedSite, setSelectedSite] = useState(sites[0]);
  const [selectedTideStationId, setSelectedTideStationId] = useState(
    tideStations[0].id
  );
  const { isSmall } = useBreakpoints();

  useEffect(() => {
    // if locationId changes, set tide station back to the default
    setSelectedTideStationId(tideStations[0].id);
    setSelectedSite(sites[0]);
  }, [locationId, tideStations, sites]);

  const usgsSiteId =
    selectedSite && selectedSite.__typename === "UsgsSite"
      ? selectedSite.id
      : undefined;

  const noaaStationId =
    selectedSite && selectedSite.__typename === "TidePreditionStation"
      ? selectedSite.id
      : undefined;

  const [tideResult, refresh] = useTideQuery({
    variables: {
      locationId,
      tideStationId: selectedTideStationId,
      usgsSiteId,
      includeUsgs: !!usgsSiteId,
      noaaStationId,
      includeNoaa: !!noaaStationId,
      startDate: format(subDays(startOfDay(date), 3), ISO_FORMAT),
      endDate: format(addDays(startOfDay(date), 4), ISO_FORMAT),
    },
    pause: selectedTideStationId === undefined,
  });

  const handleStationChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setSelectedTideStationId(e.target.value);
  };

  const handleUsgsSiteChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const match = sites.find((site) => site.id === e.target.value);
    setSelectedSite(match!);
  };

  const waterHeightBase =
    tideResult.data?.usgsSite?.waterHeight ||
    tideResult.data?.noaaWaterHeight?.waterHeight;

  if (tideResult.fetching) {
    return <Fetching />;
  } else if (
    !tideResult.data ||
    !tideResult.data.tidePreditionStation ||
    !tideResult.data.tidePreditionStation.tides ||
    !tideResult.data.location ||
    !tideResult.data.location.sun ||
    !tideResult.data.location.moon ||
    !tideResult.data.location.solunar ||
    !waterHeightBase
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
    (x) =>
      startOfDay(new Date(x.sunrise)).toISOString() ===
      startOfDay(date).toISOString()
  )[0];

  if (!sunData) return <Fetching />;

  const moonData = tideResult.data.location.moon.filter(
    (x) =>
      startOfDay(new Date(x.date)).toISOString() ===
      startOfDay(date).toISOString()
  )[0];

  const solunarData = tideResult.data.location.solunar.filter(
    (x) =>
      startOfDay(new Date(x.date)).toISOString() ===
      startOfDay(date).toISOString()
  )[0];

  const curDayWaterHeight = waterHeightBase.filter((x) =>
    isWithinInterval(new Date(x.timestamp), {
      start: startOfDay(date),
      end: startOfDay(addDays(date, 1)),
    })
  );

  const allTides = tideResult.data.tidePreditionStation.tides;
  const curDayTides = allTides.filter((x) =>
    isWithinInterval(new Date(x.time), {
      start: startOfDay(date),
      end: startOfDay(addDays(date, 1)),
    })
  );
  const { hiLowData } = buildDatasets(sunData, curDayTides, curDayWaterHeight);

  let tickValues = [];
  for (let i = 0; i <= 24; i += isSmall ? 4 : 2) {
    tickValues.push(addHours(startOfDay(date), i));
  }

  return (
    <>
      <div className="md:flex md:items-center">
        <div className="md:mb-4">
          <label className="mr-2 uppercase leading-loose text-gray-700 text-sm block md:inline-block">
            Date:
          </label>
          <DatePicker
            aria-label="select date"
            onChange={setActiveDate}
            value={date}
            clearIcon={null}
            className="inline-block"
          />
        </div>
        <div className="md:ml-4 md:mb-4">
          <TideStationSelect
            tideStations={tideStations}
            handleChange={handleStationChange}
            selectedId={selectedTideStationId}
          />
        </div>
        <div className="md:ml-4 md:mb-4">
          <UsgsSiteSelect
            sites={sites}
            handleChange={handleUsgsSiteChange}
            selectedId={selectedSite.id}
            label="Observation Site:"
          />
        </div>
      </div>
      {!isSmall && (
        <HighLowTable
          hiLowData={hiLowData}
          sunData={sunData}
          moonData={moonData}
          solunarData={solunarData}
        />
      )}
      <MainTideChart
        sunData={sunData}
        curDayTides={curDayTides}
        waterHeightData={curDayWaterHeight}
        date={date}
        solunarData={solunarData}
      />
      <MultiDayTideCharts
        sunData={tideResult.data.location.sun}
        tideData={allTides}
        waterHeightData={waterHeightBase}
        activeDate={date}
        setActiveDate={setActiveDate}
        numDays={isSmall ? 3 : 7}
      />
      <div className="items-center justify-center flex flex-wrap mt-4">
        <div className="flex justify-center items-center">
          <div className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-2 rounded-sm bg-black flex-shrink-0"></div>
          <div className="uppercase text-gray-700 text-sm">Predicted</div>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-4 h-4 md:w-6 md:h-6 md:ml-4 ml-2 mr-1 md:mr-2 rounded-sm bg-blue-600 flex-shrink-0"></div>
          <div className="uppercase text-gray-700 text-sm">Observed</div>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-4 h-4 md:w-6 md:h-6 md:ml-4 ml-2 mr-1 md:mr-2 rounded-sm bg-teal-600 flex-shrink-0"></div>
          <div className="uppercase text-gray-700 text-sm">Feeding Period</div>
        </div>
      </div>
      {isSmall && (
        <HighLowTable
          hiLowData={hiLowData}
          sunData={sunData}
          moonData={moonData}
          solunarData={solunarData}
        />
      )}
    </>
  );
};

export default Tides;

const HighLowTable: React.FC<{
  hiLowData: any[];
  sunData?: SunDetailFieldsFragment;
  moonData: MoonDetailFieldsFragment;
  solunarData: SolunarDetailFieldsFragment;
}> = ({ hiLowData, sunData, moonData, solunarData }) => {
  const formatDate = (x: string) => (
    <div className="lowercase">{format(new Date(x), "h:mma")}</div>
  );

  const formatPeriod = (period: SolunarPeriodFieldsFragment) => (
    <div className="lowercase my-1">
      {format(new Date(period.start), "h:mma")}-
      {format(new Date(period.end), "h:mma")}
    </div>
  );

  return (
    <div className="mt-4 md:mt-0 text-gray-700 grid grid-cols-2 md:flex md:flex-wrap md:items-center md:justify-center">
      {hiLowData.map(({ x, y, type }, i) => (
        <Pill key={i} label={`${type} Tide`}>
          {formatDate(x)}
        </Pill>
      ))}

      {sunData && sunData.nauticalDawn && (
        <Pill label="Naut Dawn" color="orange-700">
          {formatDate(sunData.nauticalDawn)}
        </Pill>
      )}

      {sunData && sunData.dawn && (
        <Pill label="Dawn" color="orange-700">
          {formatDate(sunData.dawn)}
        </Pill>
      )}
      {sunData && sunData.sunrise && (
        <Pill label="Sunrise" color="orange-700">
          {formatDate(sunData.sunrise)}
        </Pill>
      )}
      {sunData && sunData.sunset && (
        <Pill label="Sunset" color="orange-700">
          {formatDate(sunData.sunset)}
        </Pill>
      )}
      {sunData && sunData.dusk && (
        <Pill label="Dusk" color="orange-700">
          {formatDate(sunData.dusk)}
        </Pill>
      )}
      {sunData && sunData.nauticalDusk && (
        <Pill label="Naut Dusk" color="orange-700">
          {formatDate(sunData.nauticalDusk)}
        </Pill>
      )}
      {moonData && moonData.phase && (
        <Pill
          label="Moon Phase"
          color="blue-800"
          className="col-span-2 moon-pill"
        >
          <div className="flex items-center justify-center">
            {moonData.phase} <MoonPhase phase={moonData.phase} />
          </div>
        </Pill>
      )}
      <Pill
        color="teal-600"
        className="col-span-2 moon-pill"
        label={`Major Feeding`}
      >
        {solunarData.majorPeriods.map((period, i) => {
          return formatPeriod(period);
        })}
      </Pill>
      <Pill
        color="teal-600"
        className="col-span-2 moon-pill"
        label={`Minor Feeding`}
      >
        {solunarData.minorPeriods.map((period, i) => {
          return formatPeriod(period);
        })}
      </Pill>
    </div>
  );
};

const Pill: React.FC<{ label: string; color?: string; className?: string }> = ({
  label,
  children,
  color = "blue-600",
  className = "",
}) => {
  return (
    <div
      className={`flex items-stretch mr-2 border border-${color} rounded mb-2 ${className}`}
      style={{ flexBasis: "1" }}
    >
      <div
        className={`py-1 px-2 bg-${color} text-white flex items-center justify-center uppercase flex-shrink-0 w-3/5 md:w-auto`}
        style={{ fontSize: ".6rem" }}
      >
        {label}
      </div>
      <div className="py-1 px-1 text-center leading-none self-center w-2/5 md:w-auto text-xs">
        {children}
      </div>
    </div>
  );
};

const TideStationSelect: React.FC<{
  tideStations: TideStationDetailFragment[];
  handleChange: ChangeEventHandler<HTMLSelectElement>;
  selectedId: string;
}> = ({ tideStations, handleChange, selectedId }) => (
  <div className="py-2">
    <label className="mr-2 inline-block uppercase leading-loose text-gray-700 text-sm">
      Tide Station:
    </label>
    <div className="inline-block rounded border-gray-300 border">
      <select
        onChange={handleChange}
        value={selectedId}
        className="select-css pr-8 pl-2 py-1 bg-white text-gray-700 text-sm"
      >
        {tideStations.map((station) => (
          <option key={station.id} value={station.id}>
            {station.name}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const Fetching = () => {
  const { isSmall } = useBreakpoints();
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
};

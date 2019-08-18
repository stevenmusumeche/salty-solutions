import React, { useState, ChangeEventHandler } from "react";
import CurrentWindSummaryCard from "./components/CurrentWindSummaryCard";
import CurrentWindDetailGraph from "./components/CurrentWindDetailGraph";
import CurrentAirTempSummaryCard from "./components/CurrentAirTempSummaryCard";
import CurrentAirTempDetailGraph from "./components/CurrentAirTempDetailGraph";
import CurrentSalinitySummaryCard from "./components/CurrentSalinitySummaryCard";
import CurrentSalinityDetailGraph from "./components/CurrentSalinityDetailGraph";
import CurrentWaterTempSummaryCard from "./components/CurrentWaterTempSummaryCard";
import CurrentWaterTempDetailGraph from "./components/CurrentWaterTempDetailGraph";
import Tides from "./components/Tides";
import { useLocationsQuery, LocationsQuery } from "./generated/graphql";
import { UseQueryState } from "urql";
import Forecast from "./components/Forecast";
import "./App.css";
import RadarMap from "./components/RadarMap";
import PlusIcon from "./assets/plus-icon.svg";
import MinusIcon from "./assets/minus-icon.svg";
import { startOfDay } from "date-fns";
import DatePicker from "react-date-picker";
import SunAndMoon from "./components/SunAndMoon";
import CombinedForecast from "./components/CombinedForecast";

const App: React.FC = () => {
  const [locations] = useLocationsQuery();
  const [locationId, setLocationId] = useState("2");
  const [showRadar, setShowRadar] = useState(false);
  const [date, setDate] = useState(() => startOfDay(new Date()));
  const selectedLocation = locations.data
    ? locations.data.locations.find(location => location.id === locationId)
    : null;

  const toggleRadar = () => setShowRadar(x => !x);

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocationId(e.target.value);
  };

  const handleDateChange = (date: Date | Date[]) => {
    if (Array.isArray(date)) return;
    setDate(date);
  };

  return (
    <>
      <div className="sticky top-0 py-4 z-50 bg-gray-500 mb-8 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <LocationSelect
            locations={locations}
            onChange={handleLocationChange}
            value={locationId}
          />
          <div>
            <DatePicker
              onChange={handleDateChange}
              value={date}
              clearIcon={null}
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto pb-8 min-h-screen">
        <SectionTitle text="Current Conditions" />
        <div className="current-conditions-grid">
          <CurrentWindSummaryCard locationId={locationId} />
          <CurrentSalinitySummaryCard locationId={locationId} />
          <CurrentAirTempSummaryCard locationId={locationId} />
          <CurrentWaterTempSummaryCard locationId={locationId} />
          <CurrentWindDetailGraph locationId={locationId} />
          <CurrentSalinityDetailGraph locationId={locationId} />
          <CurrentAirTempDetailGraph locationId={locationId} />
          <CurrentWaterTempDetailGraph locationId={locationId} />
        </div>

        {
          <button
            className={`shadow-md flex items-center justify-between bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg w-48 px-4 py-2 uppercase tracking-widest ${
              !showRadar ? "mb-8" : "mb-4"
            }`}
            onClick={toggleRadar}
          >
            {showRadar ? (
              <>
                <div>Hide Radar</div>{" "}
                <img className="w-4" src={MinusIcon} alt="hide radar icon" />
              </>
            ) : (
              <>
                <div>Show Radar</div>{" "}
                <img className="w-4" src={PlusIcon} alt="show radar icon" />
              </>
            )}
          </button>
        }

        {showRadar && <RadarMap locationId={locationId} />}

        <SectionTitle text="Tides" />

        {selectedLocation && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <Tides
              locationId={locationId}
              tideStations={selectedLocation.tidePreditionStations}
              date={date}
            />
          </div>
        )}

        <SectionTitle text="Solunar Data" />
        <SunAndMoon locationId={locationId} date={date} />

        <SectionTitle text="Forecast" />
        <CombinedForecast locationId={locationId} />
        {/* 
        <SectionTitle text="Forecast" />
        <Forecast locationId={locationId} /> */}
      </div>
    </>
  );
};

export default App;

interface LocationSelectProps {
  locations: UseQueryState<LocationsQuery>;
  value: string;
  onChange: ChangeEventHandler;
}

const SectionTitle: React.FC<{ text: string }> = ({ text }) => (
  <h2 className="text-4xl mb-8">{text}</h2>
);

const LocationSelect: React.FC<LocationSelectProps> = ({
  locations,
  value,
  onChange
}) => (
  <select
    onChange={onChange}
    className="select-css h-12 text-3xl rounded shadow-md pr-16 pl-3 bg-white"
    value={value}
  >
    {locations.data &&
      locations.data.locations
        .sort((a, b) => ("" + a.name).localeCompare(b.name))
        .map(location => {
          return (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          );
        })}
  </select>
);

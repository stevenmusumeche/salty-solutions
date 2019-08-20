import { startOfDay } from "date-fns";
import React, { useState } from "react";
import "./App.css";
import MinusIcon from "./assets/minus-icon.svg";
import PlusIcon from "./assets/plus-icon.svg";
import CombinedForecast from "./components/CombinedForecast";
import CurrentAirTempDetailGraph from "./components/CurrentAirTempDetailGraph";
import CurrentAirTempSummaryCard from "./components/CurrentAirTempSummaryCard";
import CurrentSalinityDetailGraph from "./components/CurrentSalinityDetailGraph";
import CurrentSalinitySummaryCard from "./components/CurrentSalinitySummaryCard";
import CurrentWaterTempDetailGraph from "./components/CurrentWaterTempDetailGraph";
import CurrentWaterTempSummaryCard from "./components/CurrentWaterTempSummaryCard";
import CurrentWindDetailGraph from "./components/CurrentWindDetailGraph";
import CurrentWindSummaryCard from "./components/CurrentWindSummaryCard";
import Header from "./components/Header";
import HourlyForecast from "./components/HourlyForecast";
import RadarMap from "./components/RadarMap";
import SunAndMoon from "./components/SunAndMoon";
import Tides from "./components/Tides";
import { useLocationsQuery } from "./generated/graphql";
import Button from "./components/Button";
import Modal from "./components/Modal";
import About from "./components/About";

const INITIAL_LOCATION = "2";

const App: React.FC = () => {
  const [locations] = useLocationsQuery();
  const [locationId, setLocationId] = useState(INITIAL_LOCATION);
  const selectedLocation = locations.data
    ? locations.data.locations.find(location => location.id === locationId)
    : null;

  const [date, setDate] = useState(() => startOfDay(new Date()));

  const [showRadar, setShowRadar] = useState(false);
  const toggleRadar = () => setShowRadar(x => !x);

  const [showAbout, setShowAbout] = useState(false);

  const handleDateChange = (date: Date | Date[]) => {
    if (Array.isArray(date)) return;
    setDate(date);
  };

  return (
    <>
      <Header
        setLocationId={id => {
          setLocationId(id);
          window.scrollTo({ top: 0 });
        }}
        activeLocationId={locationId}
        setActiveDate={handleDateChange}
        activeDate={date}
        showAbout={() => setShowAbout(true)}
      />

      {showAbout && (
        <Modal close={() => setShowAbout(false)}>
          <About />
        </Modal>
      )}

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

        <RadarButton showRadar={showRadar} toggleRadar={toggleRadar} />

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

        <SectionTitle text="Hourly Forecast" />
        <HourlyForecast locationId={locationId} />
      </div>
    </>
  );
};

export default App;

const SectionTitle: React.FC<{ text: string }> = ({ text }) => (
  <h2 className="text-4xl mb-8">{text}</h2>
);

const RadarButton: React.FC<{
  showRadar: boolean;
  toggleRadar: () => void;
}> = ({ showRadar, toggleRadar }) => (
  <Button
    className={`w-48 ${!showRadar ? "mb-8" : "mb-4"}`}
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
  </Button>
);

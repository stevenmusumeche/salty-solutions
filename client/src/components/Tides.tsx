import React, { useState, ChangeEventHandler } from "react";
import {
  TideStationDetailFragment,
  useTideQuery,
  TideDetail
} from "../generated/graphql";
import { startOfDay, format, addHours } from "date-fns";
import {
  VictoryChart,
  VictoryAxis,
  VictoryArea,
  VictoryScatter
} from "victory";

interface Props {
  tideStations: TideStationDetailFragment[];
}

const Tides: React.FC<Props> = ({ tideStations }) => {
  const [selectedId, setSelectedId] = useState(tideStations[0].id);
  const [date, setDate] = useState(
    format(startOfDay(new Date()), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
  );

  const [tideResult] = useTideQuery({
    variables: {
      stationId: selectedId!,
      startDate: date,
      endDate: "2019-07-26T05:00:00.000Z" // todo date
    },
    pause: selectedId === undefined
  });

  if (tideResult.fetching)
    return <div style={{ width: 1280, height: 711 }}>fetching</div>;
  if (
    !tideResult.data ||
    !tideResult.data.tidePreditionStation ||
    !tideResult.data.tidePreditionStation.tides
  )
    return <div>no data</div>;

  const toVictory = (tide: TideDetail) => ({
    x: new Date(tide.time),
    y: tide.height
  });
  const tides = tideResult.data.tidePreditionStation.tides.map(toVictory);
  const peaks = tideResult.data.tidePreditionStation.tides
    .filter(tide => tide.type !== "intermediate")
    .map(toVictory);

  const handleChange: ChangeEventHandler<HTMLSelectElement> = e =>
    setSelectedId(e.target.value);

  let tickValues = [];
  for (let i = 0; i <= 24; i += 2) {
    tickValues.push(addHours(startOfDay(new Date()), i));
  }

  console.log(tides);

  return (
    <>
      <div className="mb-8">
        <TideStationSelect
          tideStations={tideStations}
          handleChange={handleChange}
        />
      </div>
      <VictoryChart
        domainPadding={{ y: 5 }}
        width={450}
        height={250}
        // style={{ parent: { backgroundColor: "white" } }}
      >
        <VictoryAxis
          style={{
            grid: { stroke: "#cbd5e0", strokeDasharray: "6" },
            tickLabels: { fontSize: 8 }
          }}
          tickFormat={date => format(new Date(date), "ha").toLowerCase()}
          tickValues={tickValues}
        />
        <VictoryAxis
          dependentAxis
          style={{
            grid: { stroke: "#cbd5e0", strokeDasharray: "6" },
            tickLabels: { fontSize: 8 }
          }}
        />
        <VictoryArea
          data={tides}
          scale={{ x: "time", y: "linear" }}
          interpolation={"natural"}
          style={{
            data: {
              strokeWidth: 0,
              fill: "#2c5282",
              fillOpacity: 0.3
            }
          }}
        />
        <VictoryScatter
          data={peaks}
          size={1.5}
          labels={data => format(new Date(data.x), "h:mma")}
          style={{
            data: {
              fill: "#2c5282"
            },
            labels: {
              fontSize: 8
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
}> = ({ tideStations, handleChange }) => (
  <select onChange={handleChange}>
    {tideStations.map(station => (
      <option key={station.id} value={station.id}>
        {station.name}
      </option>
    ))}
  </select>
);

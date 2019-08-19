import React, { ChangeEventHandler } from "react";
import DatePicker from "react-date-picker";
import { UseQueryState } from "urql";
import { LocationsQuery, useLocationsQuery } from "../generated/graphql";
import Button from "./Button";

interface Props {
  setLocationId: (id: string) => void;
  activeLocationId: string;
  setActiveDate: (date: Date | Date[]) => void;
  activeDate: Date;
}

const Header: React.FC<Props> = ({
  setLocationId,
  activeLocationId,
  activeDate,
  setActiveDate
}) => {
  const [locations] = useLocationsQuery();

  return (
    <div className="sticky top-0 py-4 z-50 bg-gray-500 mb-8 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex">
          <LocationSelect
            locations={locations}
            onChange={e => setLocationId(e.target.value)}
            value={activeLocationId}
          />
          <DatePicker
            onChange={setActiveDate}
            value={activeDate}
            clearIcon={null}
          />
        </div>
        <div>
          <Button onClick={e => {}}>About</Button>
        </div>
      </div>
    </div>
  );
};

export default Header;

interface LocationSelectProps {
  locations: UseQueryState<LocationsQuery>;
  value: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
  locations,
  value,
  onChange
}) => (
  <div className="mr-4">
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
  </div>
);

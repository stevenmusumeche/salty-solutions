import React, { ChangeEventHandler } from "react";
import { UseQueryState } from "urql";
import {
  LocationDetailFragment,
  LocationsQuery,
} from "@stevenmusumeche/salty-solutions-shared/dist/graphql";

interface LocationSelectProps {
  locations: UseQueryState<LocationsQuery>;
  value: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
  locations,
  value,
  onChange,
}) => {
  const groupedByState = locations?.data?.locations.reduce((acc, cur) => {
    if (!acc[cur.state]) acc[cur.state] = [];
    acc[cur.state].push(cur);
    return acc;
  }, {} as { [state: string]: LocationDetailFragment[] });

  return (
    <div className="">
      <select
        aria-label="select location"
        onChange={onChange}
        className="select-css py-1 px-2 text-sm rounded shadow-md bg-gray-100 w-full"
        value={value}
      >
        <option key={-1} value={"header"}>
          LOUISIANA
        </option>

        {groupedByState &&
          groupedByState["LA"]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((location) => {
              return (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              );
            })}

        <option key={-2} value={"header"}>
          TEXAS
        </option>

        {groupedByState &&
          groupedByState["TX"]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((location) => {
              return (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              );
            })}
      </select>
    </div>
  );
};

export default LocationSelect;

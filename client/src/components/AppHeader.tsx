import React, { ChangeEventHandler } from "react";
import { UseQueryState } from "urql";
import {
  LocationDetailFragment,
  LocationsQuery,
} from "@stevenmusumeche/salty-solutions-shared/dist/graphql";

interface Props {
  locations: UseQueryState<LocationsQuery>;
  setLocationId: (id: string) => void;
  activeLocationId: string;
}

const AppHeader: React.FC<Props> = ({
  locations,
  setLocationId,
  activeLocationId,
}) => {
  return (
    <div className="ml-3 md:ml-0">
      <LocationSelect
        locations={locations}
        onChange={(e) => {
          if (e.target.value !== "header") setLocationId(e.target.value);
        }}
        value={activeLocationId}
      />
    </div>
  );
};

export default AppHeader;

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
        className="select-css h-8 md:h-12 md:text-3xl rounded shadow-md pr-16 pl-3 bg-white"
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

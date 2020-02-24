import React, { ChangeEventHandler } from "react";
import { UsgsSiteDetailFragment } from "../generated/graphql";

const UsgsSiteSelect: React.FC<{
  sites: UsgsSiteDetailFragment[];
  handleChange: ChangeEventHandler<HTMLSelectElement>;
  selectedId: string;
  label?: string;
}> = ({ sites, handleChange, selectedId, label }) => (
  <div className="py-2 text-sm">
    {label && (
      <div className="mr-2 inline-block uppercase leading-loose text-gray-700 text-sm">
        {label}
      </div>
    )}
    <div className="inline-block rounded border-gray-300 border">
      <select
        onChange={handleChange}
        value={selectedId}
        className="select-css pr-8 pl-2 py-1 bg-white text-gray-700 text-sm w-full"
      >
        {sites.map(site => (
          <option key={site.id} value={site.id}>
            {site.name}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default UsgsSiteSelect;

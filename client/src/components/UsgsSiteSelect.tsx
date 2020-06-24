import React, { ChangeEventHandler } from "react";
import {
  UsgsSiteDetailFragment,
  TideStationDetailFragment,
} from "@stevenmusumeche/salty-solutions-shared/dist/graphql";

const UsgsSiteSelect: React.FC<{
  sites: Array<UsgsSiteDetailFragment | TideStationDetailFragment>;
  handleChange: ChangeEventHandler<HTMLSelectElement>;
  selectedId: string;
  label?: string;
  fullWidth?: boolean;
}> = ({ sites, handleChange, selectedId, label, fullWidth = false }) => (
  <div className="py-2 text-sm">
    {label && (
      <label className="mr-2 inline-block uppercase leading-loose text-gray-700 text-sm">
        {label}
      </label>
    )}
    <div
      className={`rounded border-gray-300 border ${
        fullWidth ? "block" : "inline-block"
      }`}
    >
      <select
        onChange={handleChange}
        value={selectedId}
        className="select-css pr-8 pl-2 py-1 bg-white text-gray-700 text-sm w-full"
      >
        {sites.map((site) => (
          <option key={site.id} value={site.id}>
            {site.name}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default UsgsSiteSelect;

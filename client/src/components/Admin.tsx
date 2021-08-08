import React from "react";
import Shell from "./Shell";
import { RouteComponentProps } from "@reach/router";
import {
  useLocationsQuery,
  LocationDetailFragment,
  UsgsSiteDetailFragment,
  TideStationDetailFragment,
  useAdminQuery,
} from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import {
  useWindSites,
  useAirTempSites,
  useWaterTempSites,
  useWaterHeightSites,
  useSalinitySites,
  useTideStationSites,
} from "@stevenmusumeche/salty-solutions-shared/dist/hooks";

const Admin: React.FC<RouteComponentProps> = () => {
  const [locations] = useLocationsQuery();
  const [adminData] = useAdminQuery();
  const locationList = locations.data?.locations || [];
  const usgsSiteList = adminData.data?.usgsSites || [];
  const noaaStationList = adminData.data?.tidePreditionStations || [];

  return (
    <Shell>
      <div className="container mx-auto my-8">
        <div className="forecast-wrapper">
          <div className="flex justify-between">
            <h1 className="text-4xl mb-4">Admin</h1>
            <div className="w-88 flex justify-between">
              <a href="#locations" className="underline text-blue-700">
                Locations
              </a>
              <a href="#noaa" className="underline text-blue-700">
                NOAA Stations
              </a>
              <a href="#usgs" className="underline text-blue-700">
                USGS Sites
              </a>
            </div>
          </div>
          <span id="locations"></span>
          <h2 className="text-3xl mb-4">Locations</h2>
          {locationList.map((location) => (
            <Location location={location} key={location.id} />
          ))}
          <span id="noaa"></span>
          <h2 className="text-3xl mb-4">NOAA Stations</h2>
          <div className="grid grid-cols-2">
            {noaaStationList.map((station) => (
              <NoaaStation station={station} key={station.id} />
            ))}
          </div>
          <span id="usgs"></span>
          <h2 className="text-3xl mb-4">USGS Sites</h2>
          <div className="grid grid-cols-2">
            {usgsSiteList.map((site) => (
              <UsgsSite site={site} key={site.id} />
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default Admin;

const Location: React.FC<{ location: LocationDetailFragment }> = ({
  location,
}) => {
  const windSites = useWindSites(location);
  const airTempSites = useAirTempSites(location);
  const waterTempSites = useWaterTempSites(location);
  const waterHeightSites = useWaterHeightSites(location);
  const salinitySites = useSalinitySites(location);
  const tideStations = useTideStationSites(location);

  return (
    <>
      <h2 className="text-2xl mb-4">{location.name}</h2>
      <div className="grid grid-cols-3">
        <div className="">
          <h3 className="text-xl mb-4">Wind</h3>
          <SiteList sites={windSites} />
        </div>
        <div>
          <h3 className="text-xl mb-4">Salinity</h3>
          <SiteList sites={salinitySites} />
        </div>
        <div>
          <h3 className="text-xl mb-4">Air Temp</h3>
          <SiteList sites={airTempSites} />
        </div>
        <div>
          <h3 className="text-xl mb-4">Water Temp</h3>
          <SiteList sites={waterTempSites} />
        </div>
        <div>
          <h3 className="text-xl mb-4">Tide Predictions Level</h3>
          <SiteList sites={tideStations} />
        </div>
        <div>
          <h3 className="text-xl mb-4">Water Level</h3>
          <SiteList sites={waterHeightSites} />
        </div>
      </div>
      <hr className="my-8" />
    </>
  );
};

const SiteList: React.FC<{
  sites: Array<UsgsSiteDetailFragment | TideStationDetailFragment>;
}> = ({ sites }) => (
  <ul className="list-disc list-inside mb-8 text-sm">
    {sites.map((site) => {
      return (
        <li className="" key={site.id}>
          {site.name}{" "}
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-blue-700"
          >
            ({site.id})
          </a>
        </li>
      );
    })}
  </ul>
);

const NoaaStation: React.FC<{
  station: TideStationDetailFragment & {
    locations: { id: string; name: string }[];
  };
}> = ({ station }) => (
  <div className="border-b border-gray-400 mb-8 pr-4">
    <h2 className="text-2xl mb-4">
      {station.name}{" "}
      <a
        href={station.url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline text-blue-700"
      >
        ({station.id})
      </a>
    </h2>
    <div className="grid grid-cols-2">
      <div>
        <h3 className="text-xl mb-4">Used By Locations</h3>
        <ul className="list-disc list-inside mb-8 text-sm">
          {station.locations.map((location) => (
            <li key={location.id}>{location.name}</li>
          ))}
        </ul>
      </div>
      <div className="">
        <h3 className="text-xl mb-4">Available Readings</h3>
        <ul className="list-disc list-inside mb-8 text-sm">
          {station.availableParamsV2.map((param) => (
            <li key={param.id}>{param.id}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const UsgsSite: React.FC<{
  site: UsgsSiteDetailFragment & {
    locations: { id: string; name: string }[];
  };
}> = ({ site }) => (
  <div className="border-b border-gray-400 mb-8 pr-4">
    <h2 className="text-2xl mb-4">
      {site.name}{" "}
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline text-blue-700"
      >
        ({site.id})
      </a>
    </h2>
    <div className="grid grid-cols-2">
      <div>
        <h3 className="text-xl mb-4">Used By Locations</h3>
        <ul className="list-disc list-inside mb-8 text-sm">
          {site.locations.map((location) => (
            <li key={location.id}>{location.name}</li>
          ))}
        </ul>
      </div>
      <div className="">
        <h3 className="text-xl mb-4">Available Readings</h3>
        <ul className="list-disc list-inside mb-8 text-sm">
          {site.availableParamsV2.map((param) => (
            <li key={param.id}>{param.id}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

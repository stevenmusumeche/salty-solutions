import React from "react";
import UrStupidFace from "../assets/steven.jpg";
import Shell from "./Shell";
import { RouteComponentProps } from "@reach/router";
import Link from "./Link";
import {
  useLocationsQuery,
  LocationDetailFragment,
} from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import { useSalinitySites, useWindSites } from "../App";

const Admin: React.FC<RouteComponentProps> = () => {
  const [locations] = useLocationsQuery();
  const locationList = locations.data?.locations || [];

  return (
    <Shell>
      <div className="container mx-auto mt-8">
        <div className="forecast-wrapper">
          <h1 className="text-4xl mb-4">Admin</h1>
          {locationList.map((location) => (
            <Location location={location} key={location.id} />
          ))}
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
  const salinitySites = useSalinitySites(location);
  return (
    <>
      <h2 className="text-2xl mb-4">{location.name}</h2>
      <div className="grid grid-cols-4">
        <div className="">
          <h3 className="text-xl mb-4">Wind</h3>
          {windSites.map((site) => {
            console.log(site);

            return (
              <ul key={site.id} className="list-disc list-inside">
                <li className="">{site.name}</li>
              </ul>
            );
          })}
        </div>
        <div>
          <h3 className="text-xl mb-4">Salinity</h3>
          {salinitySites.map((site) => {
            return (
              <ul key={site.id} className="list-disc list-inside">
                <li className="">{site.name}</li>
              </ul>
            );
          })}
        </div>
        <div className="">
          <h3 className="text-xl mb-4">Salinity</h3>
          {salinitySites.map((site) => {
            return (
              <ul key={site.id} className="list-disc list-inside">
                <li className="">{site.name}</li>
              </ul>
            );
          })}
        </div>
        <div className="">
          <h3 className="text-xl mb-4">Salinity</h3>
          {salinitySites.map((site) => {
            return (
              <ul key={site.id} className="list-disc list-inside">
                <li className="">{site.name}</li>
              </ul>
            );
          })}
        </div>
      </div>
      <hr className="my-8" />
    </>
  );
};

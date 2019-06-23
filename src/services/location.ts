export interface LocationEntity {
  id: string;
  name: string;
  tideStationIds: string[];
  marineZoneId: string;
  lat: number;
  long: number;
  usgsSiteId: string;
  weatherApiBase: string;
}

const locations: LocationEntity[] = [
  {
    id: "1",
    name: "Cypremore Point",
    tideStationIds: ["8765251", "8765148", "8765551", "8764931"],
    marineZoneId: "GMZ435",
    lat: 29.731474,
    long: -91.841371,
    usgsSiteId: "07387040",
    weatherApiBase: "https://api.weather.gov/gridpoints/LCH/112,73"
  },
  {
    id: "2",
    name: "Calcasieu Lake",
    tideStationIds: ["8768094", "8767961", "8767816"],
    marineZoneId: "GMZ432",
    lat: 29.9103,
    long: -93.2785,
    usgsSiteId: "08017095",
    weatherApiBase: "https://api.weather.gov/gridpoints/LCH//57,80"
  }
];

export const getAll = (): LocationEntity[] => locations;

export const getById = (id: string): LocationEntity | undefined => {
  return locations.find(location => location.id === id);
};
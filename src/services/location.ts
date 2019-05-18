const locations = [
  {
    id: "1",
    name: "Cypremore Point",
    tideStationIds: ["8765148", "8765551"],
    marineZoneId: "GMZ435",
    lat: 29.731474,
    long: -91.841371,
    usgsSiteId: "07387040",
    weatherApiBase: "https://api.weather.gov/gridpoints/LCH/112,73"
  }
  // {
  //   id: '2',
  //   name: "Weeks Bay",
  //   tidePreditionStations: ["8765148"],
  //   marineZoneId: "GMZ435",
  //   lat: 29.84138,
  //   long: -91.842361
  // }
];

export const getAll = () => locations;

export const getById = (id: string) => {
  return locations.find(location => location.id === id);
};

const locations = [
  {
    id: 1,
    name: "Cypremore Point",
    tideStationIds: ["8765551", "8765148"],
    marineZoneId: "GMZ435",
    lat: 29.731474,
    long: -91.841371,
    usgsSiteId: "07387040"
  }
  // {
  //   id: 2,
  //   name: "Weeks Bay",
  //   tidePreditionStations: ["8765148"],
  //   marineZoneId: "GMZ435",
  //   lat: 29.84138,
  //   long: -91.842361
  // }
];

export const getAll = () => locations;

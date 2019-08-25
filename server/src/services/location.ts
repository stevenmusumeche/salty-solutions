export interface LocationEntity {
  id: string;
  name: string;
  tideStationIds: string[];
  marineZoneId: string;
  lat: number;
  long: number;
  usgsSiteId: string;
  weatherGov: {
    apiBase: string;
    stationId: string;
    radarSiteId: string;
  };
}

const locations: LocationEntity[] = [
  {
    id: "cypremort-point",
    name: "Cypremort Point",
    tideStationIds: ["8765251", "8765148"],
    marineZoneId: "GMZ435",
    lat: 29.731474,
    long: -91.841371,
    usgsSiteId: "07387040",
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LCH/112,73",
      stationId: "KARA",
      radarSiteId: "LCH"
    }
  },
  {
    id: "calcasieu-lake",
    name: "Calcasieu Lake",
    tideStationIds: ["8768094", "8767961", "8767816"],
    marineZoneId: "GMZ432",
    lat: 29.9103,
    long: -93.2785,
    usgsSiteId: "08017095",
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LCH/57,80",
      stationId: "KLCH",
      radarSiteId: "LCH"
    }
  },
  {
    id: "cocodrie",
    name: "Cocodrie",
    tideStationIds: ["8762928", "8762888", "8762850"],
    marineZoneId: "GMZ550",
    lat: 29.246742,
    long: -90.661058,
    usgsSiteId: "073813498",
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LIX/47,58",
      stationId: "KHUM",
      radarSiteId: "LIX"
    }
  }
];

export const getAll = (): LocationEntity[] =>
  locations.sort((a, b) => a.name.localeCompare(b.name));

export const getById = (id: string): LocationEntity | undefined => {
  return locations.find(location => location.id === id);
};

export const getDataSources = (location: LocationEntity) => ({
  tideStationIds: location.tideStationIds,
  marineZoneId: location.marineZoneId,
  usgsSiteId: location.usgsSiteId,
  weatherStationId: location.weatherGov.stationId,
  weatherRadarSiteId: location.weatherGov.radarSiteId
});

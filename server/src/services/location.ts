interface Coords {
  lat: number;
  lon: number;
}

export interface UsgsSite {
  id: string;
  name: string;
  coords: Coords;
}

export interface LocationEntity {
  id: string;
  name: string;
  tideStationIds: string[];
  marineZoneId: string;
  lat: number;
  long: number;
  usgsSites: UsgsSite[];
  weatherGov: {
    apiBase: string;
    stationId: string;
    radarSiteId: string;
  };
  nowcastSubdomain?: string;
  saveOurLake?: boolean;
  modisArea: string;
}

const locations: LocationEntity[] = [
  {
    id: "cypremort-point",
    name: "Cypremort Point",
    tideStationIds: [
      "8765251",
      "8765148",
      "8765551",
      "8765568",
      "8764931",
      "8765026"
    ],
    marineZoneId: "GMZ435",
    lat: 29.731474,
    long: -91.841371,
    usgsSites: [
      {
        id: "07387040",
        name: "Vermilion Bay near Cypremort Point",
        coords: { lat: 29.7130556, lon: 91.8802778 }
      }
    ],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LCH/112,73",
      stationId: "KARA",
      radarSiteId: "LCH"
    },
    nowcastSubdomain: "0",
    modisArea: "USA7"
  },
  {
    id: "calcasieu-lake",
    name: "Calcasieu Lake",
    tideStationIds: ["8768094", "8767961", "8767816"],
    marineZoneId: "GMZ432",
    lat: 29.9103,
    long: -93.2785,
    usgsSites: [
      {
        id: "08017095",
        name: "N. Calcasieu Lake near Hackberry",
        coords: { lat: 30.0316667, lon: 93.2994444 }
      }
    ],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LCH/57,80",
      stationId: "KLCH",
      radarSiteId: "LCH"
    },
    nowcastSubdomain: "cc",
    modisArea: "USA7"
  },
  {
    id: "cocodrie",
    name: "Cocodrie",
    tideStationIds: [
      "8762928",
      "8762888",
      "8762850",
      "8763206",
      "8763506",
      "8762675"
    ],
    marineZoneId: "GMZ550",
    lat: 29.246742,
    long: -90.661058,
    usgsSites: [
      {
        id: "073813498",
        name: "Caillou Lake (Sister Lake)",
        coords: { lat: 29.2491667, lon: 90.9211111 }
      }
    ],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LIX/47,58",
      stationId: "KHUM",
      radarSiteId: "LIX"
    },
    nowcastSubdomain: "0",
    modisArea: "USA7"
  },
  {
    id: "dularge",
    name: "Dularge",
    tideStationIds: [
      "8763535", // calliou lake
      "8763506", // raccoon
      "8763206", // calliou boca
      "8763719", // ship shoal
      "8762928" // cocodrie
    ],
    marineZoneId: "GMZ550",
    lat: 29.412207,
    long: -90.782918,
    usgsSites: [
      {
        id: "073813498",
        name: "Caillou Lake (Sister Lake)",
        coords: { lat: 29.2491667, lon: 90.9211111 }
      },
      {
        id: "07381324",
        name: "Bayou Grand Caillou at Dulac",
        coords: {
          lat: 29.3827778,
          lon: 90.7152778
        }
      }
    ],
    weatherGov: {
      apiBase: "ttps://api.weather.gov/gridpoints/LIX/42,65",
      stationId: "KHUM",
      radarSiteId: "LIX"
    },
    nowcastSubdomain: "0",
    modisArea: "USA7"
  },
  {
    id: "hopedale",
    name: "Hopedale/Shell Beach",
    tideStationIds: ["8761305", "8761529", "8760742", "8761108", "8760595"],
    marineZoneId: "GMZ536",
    lat: 29.8203972,
    long: -89.65689,
    usgsSites: [
      {
        id: "073745257",
        name: "Crooked Bayou near Delacroix",
        coords: { lat: 29.7080556, lon: 89.7194444 }
      }
    ],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LIX/85,84",
      stationId: "KNBG",
      radarSiteId: "LIX"
    },
    saveOurLake: true,
    modisArea: "USA7"
  },
  {
    id: "grand-isle",
    name: "Grand Isle",
    tideStationIds: [
      "8761724",
      "8761826",
      "8761687",
      "8761677",
      "8761742",
      "8762075"
    ],
    marineZoneId: "gmz572",
    lat: 29.2366,
    long: -89.9873,
    usgsSites: [
      {
        id: "07380249",
        name: "Caminada Pass NW of Grand Isle",
        coords: { lat: 29.2313611, lon: 90.0485278 }
      }
    ],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LIX/73,58",
      stationId: "KGAO",
      radarSiteId: "LIX"
    },
    nowcastSubdomain: "0",
    modisArea: "USA7"
  },
  {
    id: "venice",
    name: "Venice",
    tideStationIds: [
      "8760721",
      "8760736",
      "8760551",
      "8760579",
      "8760922",
      "8760959",
      "8760416",
      "8760412",
      "8760424",
      "8760841",
      "8760889",
      "8761212",
      "8760595"
    ],
    marineZoneId: "GMZ555",
    lat: 29.277165,
    long: -89.3547759,
    usgsSites: [
      {
        id: "292952089453800",
        name: "Port Sulfer",
        coords: { lat: 29.4977778, lon: 89.7605556 }
      }
    ],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LIX/97,61",
      stationId: "KMIS",
      radarSiteId: "LIX"
    },
    modisArea: "USA7",
    saveOurLake: true
  },
  {
    id: "lake-ponchartrain",
    name: "Lake Ponchartrain",
    tideStationIds: [
      "8761402",
      "8761487",
      "8761927",
      "8761529",
      "TEC4445",
      "8761473",
      "8761993",
      "8762372",
      "8762483"
    ],
    marineZoneId: "GMZ530",
    lat: 30.193165894,
    long: -90.120332852,
    usgsSites: [
      {
        id: "301001089442600",
        name: "Rigolets at Hwy 90 near Slidell",
        coords: { lat: 30.1669444, lon: 89.7405556 }
      }
    ],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LIX/66,100",
      stationId: "KASD",
      radarSiteId: "LIX"
    },
    modisArea: "USA7",
    saveOurLake: true
  }
];

// delacroix
// empire
// Port Sulphur
// bay gardene
// breton island
// port fouchon
// golden meadow
// Myrtle Grove
// Happy Jack
// Isle of Pitre, Cat Island, Ship Island, and Back Bay Biloxi, Bay St. Louis.

// https://www.facebook.com/groups/154496828630117/permalink/362118351201296/

// ideas:
// show tide stations on a map
// put a link at the top of the page for each section. That way you know what all is provided without scrolling thru everything.
// barometric pressure
// native app
// see tides from days before and after
// salinity tables? not sure what that is
// pick locations from a map instead of a drop down
// river guage info - The Atchafalaya river at butte Larose is pertinent to us here on vermilion bay.

export const getAll = (): LocationEntity[] =>
  locations.sort((a, b) => a.name.localeCompare(b.name));

export const getById = (id: string): LocationEntity | undefined => {
  return locations.find(location => location.id === id);
};

export const getDataSources = (location: LocationEntity) => ({
  tideStationIds: location.tideStationIds,
  marineZoneId: location.marineZoneId,
  usgsSites: location.usgsSites,
  weatherStationId: location.weatherGov.stationId,
  weatherRadarSiteId: location.weatherGov.radarSiteId
});

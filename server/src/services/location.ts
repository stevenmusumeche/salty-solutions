export interface Coords {
  lat: number;
  lon: number;
}

export interface LocationEntity {
  id: string;
  name: string;
  tideStationIds: string[];
  marineZoneId: string;
  coords: {
    lat: number;
    lon: number;
  };
  usgsSiteIds: string[];
  weatherGov: {
    apiBase: string;
    stationId: string;
  };
  nowcastSubdomain?: string;
  saveOurLake?: boolean;
  modisArea: string;
  windfinder: {
    slug?: string;
  };
  noaaBuoyIds?: string[];
  state: "LA" | "TX";
}

const locations: LocationEntity[] = [
  {
    id: "cypremort-point",
    name: "Cypremort Point",
    state: "LA",
    tideStationIds: [
      "8765251",
      "8765148",
      "8765551",
      "8765568",
      "8764931",
      "8765026",
      "8766072",
    ],
    marineZoneId: "GMZ435",
    coords: {
      lat: 29.731474,
      lon: -91.841371,
    },
    usgsSiteIds: ["07387040", "07387050", "073816525"],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LCH/112,73",
      stationId: "KARA",
    },
    nowcastSubdomain: "0",
    modisArea: "USA7",
    windfinder: { slug: "cypremort-point_vermillion-bay" },
  },
  {
    id: "calcasieu-lake",
    name: "Calcasieu Lake",
    state: "LA",
    tideStationIds: ["8768094", "8767961", "8767816"],
    marineZoneId: "GMZ432",
    coords: {
      lat: 29.996,
      lon: -93.3421,
    },
    usgsSiteIds: ["08017118", "08017095", "08017044"],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LCH/54,83",
      stationId: "KUXL",
    },
    nowcastSubdomain: "cc",
    modisArea: "USA7",
    windfinder: { slug: "calcasieu_pass" },
  },
  {
    id: "cocodrie",
    name: "Cocodrie/Dulac",
    state: "LA",
    tideStationIds: [
      "8762928",
      "8762888",
      "8762850",
      "8763206",
      "8763506",
      "8762675",
    ],
    marineZoneId: "GMZ550",
    coords: {
      lat: 29.246742,
      lon: -90.661058,
    },
    usgsSiteIds: ["073813498", "07381324", "07381328"],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LIX/47,58",
      stationId: "KHUM",
    },
    nowcastSubdomain: "0",
    modisArea: "USA7",
    windfinder: { slug: "tambour_bay" },
  },
  {
    id: "dularge",
    name: "Dularge",
    state: "LA",
    tideStationIds: [
      "8763535", // calliou lake
      "8763506", // raccoon
      "8763206", // calliou boca
      "8763719", // ship shoal
      "8762928", // cocodrie
      "8764314", // eugene island
      "8764227", // Amerada Pass
    ],
    marineZoneId: "GMZ550",
    coords: {
      lat: 29.412207,
      lon: -90.782918,
    },
    usgsSiteIds: ["07381349", "073813498"],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LIX/42,65",
      stationId: "KHUM",
    },
    nowcastSubdomain: "0",
    modisArea: "USA7",
    windfinder: { slug: "caillou-lake" },
  },
  {
    id: "hopedale",
    name: "Hopedale/Shell Beach",
    state: "LA",
    tideStationIds: ["8761305", "8761529", "8760742", "8761108", "8760595"],
    marineZoneId: "GMZ536",
    coords: {
      lat: 29.8203972,
      lon: -89.65689,
    },
    usgsSiteIds: [
      "073745235",
      "073745257",
      // "295206089402400", not currently producing
      "07374526",
      "07374527",
      "073745275",
    ],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LIX/85,84",
      stationId: "KNBG",
    },
    // these are no longer being produced
    saveOurLake: false,
    nowcastSubdomain: "0",
    modisArea: "USA7",
    windfinder: { slug: "shell_beach" },
  },
  {
    id: "grand-isle",
    name: "Grand Isle",
    state: "LA",
    tideStationIds: [
      "8761724",
      "8761826",
      "8761687",
      "8761677",
      "8761742",
      "8762075",
    ],
    marineZoneId: "gmz572",
    coords: {
      lat: 29.2366,
      lon: -89.9873,
    },
    usgsSiteIds: [
      "07380249",
      "073802516",
      "291929089562600",
      "073802514",
      "073802512",
      "07380251",
    ],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LIX/73,58",
      stationId: "KGAO",
    },
    nowcastSubdomain: "0",
    modisArea: "USA7",
    windfinder: { slug: "grand_isle_eastern_tip" },
  },
  {
    id: "venice",
    name: "Venice",
    state: "LA",
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
      "8760595",
    ],
    marineZoneId: "GMZ555",
    coords: {
      lat: 29.277165,
      lon: -89.3547759,
    },
    usgsSiteIds: [
      "292952089453800",
      //  "291042089153000",
      "073745258",
      "07380260",
      "07374550",
      "073745275",
      "07374527",
      // "285554089242400",
    ],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LIX/97,61",
      stationId: "KMIS",
    },
    modisArea: "USA7",
    // these are no longer being produced
    saveOurLake: false,
    nowcastSubdomain: "0",
    windfinder: { slug: "pilottown" },
  },
  {
    id: "lake-ponchartrain",
    name: "Lake Ponchartrain",
    state: "LA",
    tideStationIds: [
      "8761402",
      "8761487",
      "8761927",
      "8761529",
      "TEC4445",
      "8761473",
      "8761993",
      "8762372",
      "8762483",
    ],
    marineZoneId: "GMZ530",
    coords: {
      lat: 30.0385,
      lon: -90.0264,
    },
    usgsSiteIds: [
      "301001089442600",
      "301200090072400",
      "073802332",
      "07374581",
      // "300136090064800", not producing
      // "300406090231600", not producing
      "07375230",
      "073802339",
      "073802341",
      "300703089522700",
    ],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LIX/70,93",
      stationId: "KASD",
    },
    modisArea: "USA7",
    // these are no longer being produced
    saveOurLake: false,
    nowcastSubdomain: "0",
    windfinder: { slug: "lakefront_new_orleans" },
  },
  {
    id: "rigolets",
    name: "Rigolets",
    state: "LA",
    tideStationIds: ["8761402", "8761487", "8761473"],
    marineZoneId: "GMZ534",
    coords: {
      lat: 30.170021,
      lon: -89.711048,
    },
    usgsSiteIds: [
      "301001089442600",
      "07374581",
      "073802332",
      "300703089522700",
    ],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LIX/82,99",
      stationId: "KASD",
    },
    modisArea: "USA7",
    // these are no longer being produced
    saveOurLake: false,
    nowcastSubdomain: "0",
    windfinder: { slug: "lake_pontchartrain_rigolets" },
  },
  {
    id: "lafitte",
    name: "Lafitte",
    state: "LA",
    tideStationIds: ["8761732", "8761899", "8761819"],
    marineZoneId: "GMZ552",
    coords: {
      lat: 29.6669,
      lon: -90.1084,
    },
    usgsSiteIds: [
      "07380251",
      "291929089562600",
      "292800090060000",
      "07380335",
      "07380330",
      "073802516",
    ],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LIX/68,77",
      stationId: "KGAO",
    },
    modisArea: "USA7",
    saveOurLake: false,
    nowcastSubdomain: "0",
    windfinder: { slug: "little-lake_bay-dosgris" },
  },
  {
    id: "sabine-lake",
    name: "Sabine Lake",
    state: "TX",
    tideStationIds: ["8770822", "8770570", "8770475", "8770520"],
    marineZoneId: "GMZ450",
    coords: {
      lat: 29.732984,
      lon: -93.9048,
    },
    usgsSiteIds: ["295744093303800"],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LCH/33,71",
      stationId: "KBPT",
    },
    modisArea: "USA7",
    saveOurLake: false,
    nowcastSubdomain: "sn",
    windfinder: { slug: "sabine_pass_north" },
  },
  {
    id: "port-fourchon",
    name: "Port Fourchon",
    state: "LA",
    tideStationIds: [
      "8762075",
      "8762223",
      "8762481",
      "8762084",
      "8761826",
      "8761724",
    ],
    noaaBuoyIds: ["KXPY", "LOPL1"],
    marineZoneId: "gmz572",
    coords: {
      lat: 29.1056,
      lon: -90.1944,
    },
    usgsSiteIds: ["07380249", "291929089562600"],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LIX/65,52",
      stationId: "KXPY",
    },
    nowcastSubdomain: "0",
    modisArea: "USA7",
    windfinder: { slug: "port_fourchon" },
  },
  {
    id: "point-aux-chenes",
    name: "Pointe-aux-Chenes",
    state: "LA",
    tideStationIds: ["8762184", "8762928", "8762481"],
    noaaBuoyIds: [],
    marineZoneId: "GMZ550",
    coords: {
      lat: 29.497624,
      lon: -90.555479,
    },
    usgsSiteIds: ["07381328", "07381324", "073813498"],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LIX/51,69",
      stationId: "KHUM",
    },
    nowcastSubdomain: "0",
    modisArea: "USA7",
    windfinder: { slug: "bayou-petit-caillou-lapeyrouse" },
  },
  {
    id: "leeville",
    name: "Leeville",
    state: "LA",
    tideStationIds: ["8762084", "8762075", "8762184", "8762223", "8761724"],
    noaaBuoyIds: [],
    marineZoneId: "GMZ552",
    coords: {
      lat: 29.2499,
      lon: -90.2119,
    },
    usgsSiteIds: ["07380249", "07380251"],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LIX/64,58",
      stationId: "KGAO",
    },
    nowcastSubdomain: "0",
    modisArea: "USA7",
    windfinder: { slug: "port_fourchon" },
  },
  {
    id: "golden-meadow",
    name: "Golden Meadow",
    state: "LA",
    tideStationIds: ["8762184", "8762084", "8762481", "8761724"],
    noaaBuoyIds: [],
    marineZoneId: "GMZ552",
    coords: {
      lat: 29.3791,
      lon: -90.2601,
    },
    usgsSiteIds: ["07380249", "07380251"],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LIX/62,64",
      stationId: "KGAO",
    },
    nowcastSubdomain: "0",
    modisArea: "USA7",
    windfinder: { slug: "galliano_south_lafourche_airport" },
  },
  {
    id: "pointe-a-la-hache",
    name: "Pointe a La Hache",
    state: "LA",
    tideStationIds: ["8761108", "8760721"],
    noaaBuoyIds: [],
    marineZoneId: "GMZ536",
    coords: {
      lat: 29.5751,
      lon: -89.7902,
    },
    usgsSiteIds: ["292952089453800", "073745258", "073745275"],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/LIX/80,73",
      stationId: "KLNQ",
    },
    modisArea: "USA7",
    // these are no longer being produced
    saveOurLake: false,
    nowcastSubdomain: "0",
    windfinder: { slug: "bay-gardene_point-a-la-hache" },
  },
  {
    id: "galveston",
    name: "Galveston",
    state: "TX",
    tideStationIds: [
      "8771450",
      "8771013",
      "8770613",
      "8770971",
      "8771341",
      "8771972",
    ],
    noaaBuoyIds: ["42035"],
    marineZoneId: "GMZ335",
    coords: {
      lat: 29.3013,
      lon: -94.7977,
    },
    usgsSiteIds: ["08077637"],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/HGX/86,75",
      stationId: "KGLS",
    },
    modisArea: "USA7",
    windfinder: { slug: "port_bolivar_crystal_beach" },
    nowcastSubdomain: "gb",
  },
  {
    id: "freeport",
    name: "Freeport",
    state: "TX",
    tideStationIds: ["8772471", "8772447", "8772132", "8771972", "8772985"],
    noaaBuoyIds: [],
    marineZoneId: "GMZ335",
    coords: {
      lat: 28.9541,
      lon: -95.3597,
    },
    usgsSiteIds: [],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/HGX/64,60",
      stationId: "KLBX",
    },
    modisArea: "USA7",
    windfinder: { slug: "surfside_beach_freeport" },
    nowcastSubdomain: "gb",
  },
  {
    id: "matagorda",
    name: "Matagorda",
    state: "TX",
    tideStationIds: [
      "8773146",
      "8773767",
      "8772985",
      "8773701",
      "8773259",
      "8774230",
      "8773037",
    ],
    noaaBuoyIds: ["KBQX"],
    marineZoneId: "GMZ330",
    coords: {
      lat: 28.6911,
      lon: -95.9683,
    },
    usgsSiteIds: [],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/HGX/41,49",
      stationId: "KLBX",
    },
    modisArea: "USA7",
    windfinder: { slug: "matagorda_little-boggy-creek" },
    nowcastSubdomain: "ma",
  },
  {
    id: "corpus-christi",
    name: "Corpus Christi",
    state: "TX",
    tideStationIds: [
      "8775296",
      "8775283",
      "8775237",
      "8775241",
      "8775083",
      "8775792",
      "8774770",
      "8775870",
      "8776139",
    ],
    noaaBuoyIds: [],
    marineZoneId: "GMZ230",
    coords: {
      lat: 27.8006,
      lon: -97.3964,
    },
    usgsSiteIds: [],
    weatherGov: {
      apiBase: "https://api.weather.gov/gridpoints/CRP/111,33",
      stationId: "KCRP",
    },
    modisArea: "USA6",
    windfinder: { slug: "texas_state_aquarium" },
  },
];

// Isle of Pitre, Cat Island, Ship Island, and Back Bay Biloxi, Bay St. Louis.

// https://www.facebook.com/groups/154496828630117/permalink/362118351201296/

// ideas:
// show tide stations on a map
// barometric pressure
// river guage info - The Atchafalaya river at butte Larose is pertinent to us here on vermilion bay.

export const getAll = (): LocationEntity[] =>
  locations.sort((a, b) => a.name.localeCompare(b.name));

export const getById = (id: string): LocationEntity | undefined => {
  return locations.find((location) => location.id === id);
};

export const getDataSources = (location: LocationEntity) => ({
  tideStationIds: location.tideStationIds,
  marineZoneId: location.marineZoneId,
  usgsSiteIds: location.usgsSiteIds,
  weatherStationId: location.weatherGov.stationId,
  weatherRadarSiteId: "deprecated",
});

export const makeCacheKey = (location: LocationEntity, key: string) => {
  return `${location.id}-${key}`;
};

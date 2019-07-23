import gql from "graphql-tag";

const MAP_QUERY = gql`
  query Maps($locationId: ID!) {
    location(id: $locationId) {
      maps {
        radar(numImages: 8) {
          timestamp
          imageUrl
        }
        overlays {
          ...OverlayMaps
        }
      }
    }
  }

  fragment OverlayMaps on Overlays {
    topo
    counties
    rivers
    highways
    cities
  }
`;

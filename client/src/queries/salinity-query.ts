import gql from "graphql-tag";

const SALINITY_QUERY = gql`
  query Salinity($locationId: ID!) {
    location(id: $locationId) {
      salinitySummary: salinity(numHours: 12) {
        summary {
          mostRecent {
            salinity
          }
        }
      }
    }

    detail: location(id: $locationId) {
      salinityDetail: salinity(numHours: 48) {
        detail {
          timestamp
          salinity
        }
      }
    }
  }
`;

export default SALINITY_QUERY;

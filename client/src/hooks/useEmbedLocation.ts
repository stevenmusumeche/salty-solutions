import { useMemo } from "react";
import { useLocation } from "@reach/router";
import { useLocationsQuery } from "@stevenmusumeche/salty-solutions-shared/dist/graphql";

const useQuery = (queryParam: string) => {
  const search = new URLSearchParams(useLocation().search);
  return search.get(queryParam);
};

export const useEmbedLocation = () => {
  const locationId = useQuery("location");
  const [locations] = useLocationsQuery();

  const selectedLocation = useMemo(() => {
    return locations.data
      ? locations.data.locations.find((location) => location.id === locationId)
      : null;
  }, [locationId, locations.data]);

  return useMemo(
    () => ({
      location: selectedLocation,
      loading: locations.fetching,
      locationId,
    }),
    [selectedLocation, locations.fetching, locationId]
  );
};

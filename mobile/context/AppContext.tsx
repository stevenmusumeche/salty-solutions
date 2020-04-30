// const [{ data, fetching, error }] = useLocationsQuery();
// console.log({ data, fetching, error });

import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  useLocationsQuery,
  LocationDetailFragment,
} from '../components/graphql-generated';

interface AppContext {
  locations: LocationDetailFragment[];
  activeLocation: LocationDetailFragment;
  actions: {
    setLocation: (location: LocationDetailFragment) => void;
  };
}

export const AppContext = createContext({} as AppContext);

export const AppContextProvider: React.FC = ({ children }) => {
  const [locations, setLocations] = useState<LocationDetailFragment[]>([]);
  const [activeLocation, setActiveLocation] = useState<LocationDetailFragment>(
    {} as LocationDetailFragment,
  );

  const setLocation = useCallback((location: LocationDetailFragment) => {
    setActiveLocation(location);
  }, []);

  const providerValue: AppContext = useMemo(
    () => ({
      locations,
      activeLocation,
      actions: {
        setLocation,
      },
    }),
    [locations, activeLocation, setLocation],
  );

  const [{ data }] = useLocationsQuery();

  useEffect(() => {
    if (!data) {
      return;
    }

    setLocations(data.locations);
    setActiveLocation(data.locations[0]);
  }, [data]);

  return (
    <AppContext.Provider value={providerValue}>{children}</AppContext.Provider>
  );
};

import { startOfDay, subHours } from 'date-fns';
import React, { useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { blue, gray } from '../colors';
import Card from '../components/Card';
import FullScreenLoader from '../components/FullScreenLoader';
import { AppContext } from '../context/AppContext';
import { useHeaderTitle } from '../hooks/use-header-title';
import { useLocationSwitcher } from '../hooks/use-location-switcher';
import { useWindData } from '../hooks/use-wind-data';
// import {useCurrentWindData} from "../../client/src/hooks/useWindData";
import BigBlue from './BigBlue';
import LoaderBlock from './LoaderBlock';
import '@stevenmusumeche/salty-solutions-shared';

interface Props {}

const WindCard: React.FC = () => {
  useLocationSwitcher();
  useHeaderTitle('Current Conditions');

  const headerText = 'Wind (mph)';

  const { activeLocation } = useContext(AppContext);
  const date = startOfDay(new Date());
  const {
    curValue,
    curDetail,
    curDirectionValue,
    fetching,
    error,
    refresh,
  } = useWindData(activeLocation.id, subHours(date, 48), date);

  if (fetching) {
    return (
      <Card headerText={headerText}>
        <LoaderBlock />
      </Card>
    );
  }

  return (
    <Card headerText={headerText}>
      <BigBlue>{curValue}</BigBlue>
      <View>
        <Text>graph here</Text>
      </View>
      <View style={styles.directionWrapper}>
        <Text style={styles.directionText}>{curDirectionValue}</Text>
      </View>
    </Card>
  );
};

export default WindCard;

const styles = StyleSheet.create({
  directionWrapper: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  directionText: {
    color: blue[800],
    fontSize: 18,
  },
});

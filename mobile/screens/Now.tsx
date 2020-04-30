import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React, { useContext, useState, useEffect } from 'react';
import FullScreenLoader from '../components/FullScreenLoader';
import { AppContext } from '../context/AppContext';
import { useHeaderTitle } from '../hooks/use-header-title';
import { useLocationSwitcher } from '../hooks/use-location-switcher';
import { config } from './app-config';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useCurrentConditionsDataQuery } from '../components/graphql-generated';
import { startOfDay, subHours } from 'date-fns';
import { useWindData } from '../hooks/use-wind-data';
import CardGrid from '../components/CardGrid';
import Card from '../components/Card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { blue } from '../colors';
import WindCard from '../components/WindCard';
import BigBlue from '../components/BigBlue';

const NowStack = createStackNavigator();

interface Props {
  // navigation: StackNavigationProp<any, 'Current Conditions'>;
}

const Now: React.FC<Props> = () => {
  useLocationSwitcher();
  useHeaderTitle('Current Conditions');

  // const { activeLocation } = useContext(AppContext);

  return (
    <View style={{ flex: 1, margin: 10 }}>
      <ScrollView>
        <CardGrid>
          <WindCard />
          <Card headerText="Air Temperature (F)">
            <BigBlue>69°</BigBlue>
          </Card>
          <Card headerText="Water Temperature (F)">
            <Text>content</Text>
          </Card>
          <Card headerText="Salinity">
            <Text>content</Text>
          </Card>
        </CardGrid>
      </ScrollView>
    </View>
  );
};

const NowScreen = () => (
  <NowStack.Navigator {...config}>
    <NowStack.Screen name="Current Conditions" component={Now} />
  </NowStack.Navigator>
);

export default NowScreen;

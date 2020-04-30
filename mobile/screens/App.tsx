import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import NowScreen from './Now';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocationSwitcher } from '../hooks/use-location-switcher';
import { useHeaderTitle } from '../hooks/use-header-title';

const AppTabs = createBottomTabNavigator();
const StubStack = createStackNavigator();

const Stub = () => {
  useLocationSwitcher();
  useHeaderTitle('Stub');
  return (
    <View>
      <Text>Stub</Text>
    </View>
  );
};

const StubScreen = () => {
  return (
    <StubStack.Navigator>
      <StubStack.Screen name="Stub" component={Stub} />
    </StubStack.Navigator>
  );
};

const AppScreen = () => {
  return (
    <AppTabs.Navigator
      tabBarOptions={{
        activeTintColor: '#fec857',
        inactiveTintColor: 'white',
      }}
    >
      <AppTabs.Screen
        name="Now"
        component={NowScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="today" size={size} color={color} />
          ),
        }}
      />
      <AppTabs.Screen
        name="Tides"
        component={StubScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chart-line"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <AppTabs.Screen
        name="Forecast"
        component={StubScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="weather-cloudy"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <AppTabs.Screen
        name="Maps"
        component={StubScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="radar" size={size} color={color} />
          ),
        }}
      />
      <AppTabs.Screen
        name="Satellite"
        component={StubScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="map-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </AppTabs.Navigator>
  );
};

export default AppScreen;

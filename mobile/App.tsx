import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Button, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppScreen from './screens/App';
import { AppContextProvider } from './context/AppContext';

import { createClient, Provider } from 'urql';
import ChangeLocationScreen from './screens/ChangeLocation';

const client = createClient({
  url: 'https://o2hlpsp9ac.execute-api.us-east-1.amazonaws.com/prod/api',
});

const RootStack = createStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#e2e8f0',
    card: '#2d3748',
    text: 'white',
  },
};

const App = () => {
  return (
    <Provider value={client}>
      <AppContextProvider>
        <NavigationContainer theme={MyTheme}>
          <StatusBar barStyle="light-content" />
          <RootStack.Navigator
            mode="modal"
            screenOptions={{ headerShown: false }}
          >
            <RootStack.Screen name="App" component={AppScreen} />
            <RootStack.Screen
              name="ChangeLocation"
              component={ChangeLocationScreen}
            />
          </RootStack.Navigator>
        </NavigationContainer>
      </AppContextProvider>
    </Provider>
  );
};

export default App;

import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useLayoutEffect } from 'react';
import { View } from 'react-native';

export const useLocationSwitcher = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <View style={{ marginRight: 10 }}>
            <Octicons
              name="location"
              size={24}
              color="#fec857"
              onPress={() => navigation.push('ChangeLocation')}
            />
          </View>
        );
      },
    });
  }, [navigation]);
};

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useContext, useLayoutEffect } from 'react';
import { AppContext } from '../context/AppContext';

export const useHeaderTitle = (title: string) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { activeLocation } = useContext(AppContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: title + ' for ' + activeLocation.name,
    });
  }, [activeLocation, navigation, title]);
};

import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { Button, StatusBar, StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LocationDetailFragment } from '../components/graphql-generated';
import { AppContext } from '../context/AppContext';

interface Props {
  navigation: StackNavigationProp<any, 'ChangeLocation'>;
}

const ChangeLocationScreen: React.FC<Props> = ({ navigation }) => {
  const { locations, activeLocation, actions } = useContext(AppContext);

  const handleLocationSelection = (location: LocationDetailFragment) => {
    actions.setLocation(location);
    navigation.goBack();
  };

  const data = locations.filter(
    (location) => location.id !== activeLocation.id,
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.header}>Current Location:</Text>
      <Text style={styles.current}>{activeLocation.name}</Text>
      <Text style={styles.header}>Select New Location:</Text>
      <FlatList
        style={styles.list}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button
            title={item.name}
            onPress={() => handleLocationSelection(item)}
          />
        )}
        ItemSeparatorComponent={Separator}
      />
    </SafeAreaView>
  );
};

const Separator = () => <View style={styles.separator} />;

export default ChangeLocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    margin: 20,
    marginTop: 0,
  },
  header: {
    fontSize: 20,
    marginTop: 30,
    marginBottom: 5,
  },
  current: {
    fontSize: 20,
    color: 'grey',
    fontStyle: 'italic',
  },
  list: {
    marginTop: 10,
    width: '100%',
  },
  separator: {
    marginVertical: 5,
  },
});

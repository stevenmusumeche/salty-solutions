import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, RefreshControl, Button } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import PalettePreview from '../components/PalettePreview';

interface Color {
  colorName: string;
  hexCode: string;
}

interface GroupState {
  paletteName: string;
  colors: Color[];
}

const Home = ({ navigation, route }) => {
  const [groups, setGroups] = useState<GroupState[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const newPalette = route.params ? route.params.newPalette : null;

  useEffect(() => {
    if (newPalette) {
      setGroups((current) => [newPalette, ...current]);
    }
  }, [newPalette]);

  const fetchData = useCallback(async () => {
    fetch('https://color-palette-api.kadikraman.now.sh/palettes')
      .then((r) => r.json())
      .then((data) => setGroups(data));
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (groups.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Button
        title="Add a color scheme"
        onPress={() => {
          navigation.push('AddNewPalette');
        }}
      />
      <FlatList
        data={groups}
        keyExtractor={(item) => item.paletteName}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => (
          <PalettePreview
            item={item}
            onPress={() =>
              navigation.push('ColorPalette', {
                paletteName: item.paletteName,
                colors: item.colors,
              })
            }
          />
        )}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
    flex: 1,
  },
  groupTitle: { fontSize: 24, fontWeight: 'bold' },
  smallPalette: {
    width: 50,
    height: 50,
    marginRight: 5,
    marginBottom: 20,
  },
});

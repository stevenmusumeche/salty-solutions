import React from 'react';
import { Text, StyleSheet, FlatList } from 'react-native';
import ColorBox from '../components/ColorBox';

const ColorPalette = ({ route }) => {
  return (
    <FlatList
      style={styles.container}
      data={route.params.colors}
      keyExtractor={(item) => item.hexCode}
      renderItem={(data) => (
        <ColorBox color={data.item.hexCode} name={data.item.colorName} />
      )}
    />
  );
};

export default ColorPalette;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

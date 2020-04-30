import React, { Fragment } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';

const PalettePreview = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.groupTitle}>{item.paletteName}</Text>
      <FlatList
        horizontal={true}
        data={item.colors.slice(0, 5)}
        keyExtractor={(item) => item.hexCode}
        renderItem={({ item }) => (
          <View
            style={[
              styles.smallPalette,
              {
                backgroundColor: item.hexCode,
              },
            ]}
          />
        )}
      />
    </TouchableOpacity>
  );
};

export default PalettePreview;

const styles = StyleSheet.create({
  groupTitle: { fontSize: 24, fontWeight: 'bold' },
  smallPalette: {
    width: 50,
    height: 50,
    marginRight: 5,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
});

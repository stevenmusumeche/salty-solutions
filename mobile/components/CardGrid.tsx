import React from 'react';
import { StyleSheet, View } from 'react-native';

const CardGrid: React.FC = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

export default CardGrid;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

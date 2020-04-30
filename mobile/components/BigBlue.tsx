import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { blue } from '../colors';

const BigBlue: React.FC = ({ children }) => (
  <Text style={styles.container}>{children}</Text>
);

export default BigBlue;

const styles = StyleSheet.create({
  container: {
    color: blue[800],
    fontSize: 60,
  },
});

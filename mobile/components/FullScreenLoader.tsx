import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const FullScreenLoader = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
});

export default FullScreenLoader;

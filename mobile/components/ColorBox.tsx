import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  color: string;
  name: string;
}

const App: React.FC<Props> = (props) => {
  const colorStyle = { backgroundColor: props.color };
  const textStyle = {
    color:
      parseInt(props.color.replace('#', ''), 16) > 0xffffff / 1.1
        ? 'black'
        : 'white',
  };

  return (
    <View style={[styles.box, colorStyle]}>
      <Text style={[styles.boxText, textStyle]}>
        {props.name} {props.color}
      </Text>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  box: {
    marginBottom: 10,
    padding: 10,
    alignItems: 'center',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  boxText: { color: 'white', fontWeight: 'bold' },
});

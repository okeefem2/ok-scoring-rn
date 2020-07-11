import React from 'react';
import { StyleSheet, View, } from 'react-native';
import NewGame from './pages/new-game/NewGame';

export default function App() {

  return (
    <View style={styles.container}>
        <NewGame/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 50,
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

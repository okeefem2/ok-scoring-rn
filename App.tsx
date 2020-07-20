import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import NewGame from './pages/new-game/NewGame';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';

export default function App() {

  const [loaded, error] = useFonts({
    Quicksand: require('./assets/fonts/Quicksand/static/Quicksand-Regular.ttf'),
  });


  if (!loaded) {
    return <>
      <Text>...Loading</Text>
    </>;
  }

  // TODO set some global font family?
  if (error) {
    console.log('error loading fonts!!', error);
  }

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

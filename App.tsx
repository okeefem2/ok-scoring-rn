import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import NewGame from './pages/new-game/NewGame';
import { useFonts } from 'expo-font';
import { initLocalDb } from './db/db';
export default function App() {

  const [dbAvailable, setDbAvailable] = useState(false);

  const [loaded, error] = useFonts({
    Quicksand: require('./assets/fonts/Quicksand/static/Quicksand-Regular.ttf'),
  });

  useEffect(() => {
    initLocalDb().then(
      () => {
        console.log('DB initialized')
        setDbAvailable(true);
      }
    ).catch(
      (err) => console.error('Error initializing local DB', err)
    );
    return () => {
      // TODO clean up db?
    }
  }, []);


  if (!loaded || !dbAvailable) {
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
        <NewGame
          dbAvailable={dbAvailable}
        />
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

import React, { useEffect, useContext } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { useFonts } from 'expo-font';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import NewGame, { RouteName as NewGameRoute } from './pages/new-game/NewGame';
import Game, { RouteName as GameRoute } from './pages/game/Game';
import GameHistory, { RouteName as GameHistoryRoute } from './pages/game-history/GameHistory';
import ScoreHistory, { RouteName as ScoreHistoryRoute } from './pages/score-history/ScoreHistory';
import GameSettings, { RouteName as GameSettingsRoute } from './pages/game-settings/GameSettings';
import CenterContent from './components/CenterContent';
import { localDbContext } from './state/local-db.store';
import { sharedStyles } from './styles/shared';
import { gameHistoryContext } from './state/game-history.store';
import { playerHistoryContext } from './state/players-history.store';

function App() {

  const { dbInitialized, initLocalDb } = useContext(localDbContext);
  const { loadGames } = useContext(gameHistoryContext);
  const { loadPlayers } = useContext(playerHistoryContext);

  const [fontsLoaded, error] = useFonts({
    Quicksand: require('./assets/fonts/Quicksand/static/Quicksand-Regular.ttf'),
  });

  const initDbAndData = async () => {
    await initLocalDb();
    loadGames();
    loadPlayers();
  }

  useEffect(() => {
    if (fontsLoaded) {
      initDbAndData();

    }
    return () => {
      // TODO clean up db?
    }
  }, [fontsLoaded]);


  if (!fontsLoaded || !dbInitialized) {
    return <>
      <View style={sharedStyles.column}>
        <CenterContent>
            <Image
                source={require('./assets/icon.png')}
                style={sharedStyles.logoImage}
                resizeMode='contain'
            />
          </CenterContent>
        <Text style={[sharedStyles.centeredText]}>...Loading</Text>
      </View>
    </>;
  }

  // TODO set some global font family?
  if (error) {
    console.error('error loading fonts!!', error);
  }

  const Stack = createStackNavigator();

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={NewGameRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name={NewGameRoute} component={NewGame}/>
          <Stack.Screen name={GameRoute} component={Game}/>
          <Stack.Screen name={GameHistoryRoute} component={GameHistory}/>
          <Stack.Screen name={ScoreHistoryRoute} component={ScoreHistory}/>
          <Stack.Screen name={GameSettingsRoute} component={GameSettings}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default observer(App);

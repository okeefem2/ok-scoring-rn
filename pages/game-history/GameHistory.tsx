import React, { useContext } from 'react';
import { Text, FlatList, Alert } from 'react-native';
import NavBar from '../../components/NavBar';
import { sharedStyles } from '../../styles/shared';
import GameHistoryListItem from './components/dumb/GameHistoryListItem';
import { gameHistoryContext } from '../../state/game-history.store';
import { gameContext } from '../../state/game.store';
import { observer } from 'mobx-react';
import { GameRoute, GameHistoryRoute, GameScoreHistoryRoute, PageNavigationProps } from '../../navigation';
import { GameState } from '../../model/game-state';
import { SafeAreaView } from 'react-native-safe-area-context';

const GameHistory = ({ navigation }: PageNavigationProps<typeof GameHistoryRoute>) => {
    const { gameHistory, setGameState, setHistorySort, sort, deleteGame } = useContext(gameHistoryContext);
    const { copyGameSetup, initGameState: initNewGame } = useContext(gameContext);
    const showGameState = (gameState: GameState) => {
        setGameState(gameState);
        navigation.navigate(GameScoreHistoryRoute);
    }

    const confirmDeleteGame = (gameKey: string) =>
        Alert.alert(
            'Are you sure?',
            'Deleting this game will be permanent',
            [
                {
                    text: "Nevermind",
                    onPress: () => { },
                    style: "cancel"
                },
                { text: `I'm Sure`, onPress: () => deleteGame(gameKey) }
            ]
        );
    return (
        <SafeAreaView style={sharedStyles.pageContainer}>
            <NavBar
                leftButton={{ icon: 'chevron-left', title: 'Back', clickHandler: navigation.goBack }}
                rightButton={{ icon: sort.asc ? 'sort-descending' : 'sort-ascending', title: 'Sort By Date', clickHandler: () => setHistorySort({ ...sort, asc: !sort.asc }) }}
            />

            <FlatList
                style={sharedStyles.scroll}
                data={gameHistory}
                ListEmptyComponent={
                    <Text style={[sharedStyles.bodyText, sharedStyles.centeredText, sharedStyles.mt25]}>No Games Played Yet!</Text>
                }
                renderItem={
                    (itemData) =>
                        <GameHistoryListItem
                            sort={sort}
                            index={itemData.index}
                            game={itemData.item}
                            copyGameSetup={(...args) => {
                                copyGameSetup(...args);
                                navigation.goBack();
                            }}
                            continueGame={(gameState) => {
                                initNewGame(gameState);
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: GameRoute }],
                                })
                            }}
                            deleteGame={confirmDeleteGame}
                            showGameState={showGameState}
                            key={itemData.item.key}
                        />
                }
            />
        </SafeAreaView>
    );
}

export default observer(GameHistory);

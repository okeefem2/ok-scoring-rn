import React, { useContext } from 'react';
import { Text, FlatList } from 'react-native';
import NavBar from '../../components/NavBar';
import { sharedStyles } from '../../styles/shared';
import GameHistoryListItem from './components/dumb/GameHistoryListItem';
import { gameHistoryContext } from '../../state/game-history.store';
import { gameContext } from '../../state/game.store';
import { observer } from 'mobx-react';
import { PageNavigationProps } from '../../navigation';
import { RouteName as GameRoute } from '../game/Game';
import { RouteName as GameScoreHistoryModalRoute } from '../game-score-history/GameScoreHistory';
import { GameState } from '../../model/game-state';
import { SafeAreaView } from 'react-native-safe-area-context';

const GameHistory = ({ navigation }: PageNavigationProps<typeof RouteName>) => {
    const {gameHistory, setGameState, setHistorySort, sort } = useContext(gameHistoryContext);
    const {copyGameSetup, initGameState: initNewGame} = useContext(gameContext);
    const showGameState = (gameState: GameState) => {
        setGameState(gameState);
        navigation.navigate(GameScoreHistoryModalRoute);
    }
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
                            showGameState={showGameState}
                            key={itemData.item.key}
                        />
                }
            />
        </SafeAreaView>
    );
}

export const RouteName = 'GameHistory';
export default observer(GameHistory);

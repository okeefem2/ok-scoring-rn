import React, { useContext } from 'react';
import { Text, FlatList, View } from 'react-native';
import NavBar from '../../components/NavBar';
import { sharedStyles } from '../../styles/shared';
import GameHistoryListItem from './components/dumb/GameHistoryListItem';
import { gameHistoryContext } from '../../state/game-history.store';
import { gameContext } from '../../state/game.store';
import { observer } from 'mobx-react';
import { PageNavigationProps } from '../../navigation';
import { RouteName as GameRoute } from '../game/Game';
import { RouteName as GameScoreHistoryModalRoute } from '../game-score-history-modal/GameScoreHistoryModal';
import { GameState } from '../../model/game-state';

const GameHistory = ({ navigation }: PageNavigationProps<typeof RouteName>) => {
    const {gameHistory, setGameState} = useContext(gameHistoryContext);
    const {copyGameSetup, initGameState: initNewGame} = useContext(gameContext);
    const showGameState = (gameState: GameState) => {
        setGameState(gameState);
        navigation.navigate(GameScoreHistoryModalRoute);
    }
    return (
        <View style={sharedStyles.pageContainer}>
            <NavBar
                leftButton={{ icon: 'chevron-left', title: 'Back', clickHandler: navigation.goBack }}
            />
            <FlatList
                style={sharedStyles.scroll}
                data={gameHistory}
                ListEmptyComponent={
                    <Text style={[sharedStyles.bodyText, sharedStyles.centeredText, sharedStyles.mt25]}>No Games Played Yet!</Text>
                }
                renderItem={
                    (itemData) => <GameHistoryListItem
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
                                        key={itemData.item.key}
                                        showGameState={showGameState}
                                        />
                }
            />
        </View>
    );
}

export const RouteName = 'GameHistory';
export default observer(GameHistory);

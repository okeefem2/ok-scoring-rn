import React, { useContext } from 'react';
import { Text, FlatList } from 'react-native';
import NavBar from '../../components/NavBar';
import { sharedStyles } from '../../styles/shared';
import GameHistoryListItem from './components/dumb/GameHistoryListItem';
import { gameHistoryContext } from '../../state/game-history.store';
import { gameContext } from '../../state/game.store';
import { observer } from 'mobx-react';
import { RootStackParamList } from '../../navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteName as GameRoute } from '../game/Game';

type GameHistoryNavigationProps = {
    navigation: StackNavigationProp<RootStackParamList, typeof RouteName>
};
const GameHistory = ({ navigation }: GameHistoryNavigationProps) => {
    const {gameHistory} = useContext(gameHistoryContext);
    const {copyGameSetup, initGameState: initNewGame} = useContext(gameContext);
    return (
        <>
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
                                        />
                }
            />
        </>
    );
}

export const RouteName = 'GameHistory';
export default observer(GameHistory);

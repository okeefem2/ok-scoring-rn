import React, { useContext } from 'react'
import { Text, View, FlatList } from 'react-native'
import { observer } from 'mobx-react';
import { PageNavigationProps } from '../../navigation';
import NavBar from '../../components/NavBar';
import { sharedStyles } from '../../styles/shared';
import GameScoreListItem from '../game-scores/components/GameScoresListItem';
import { gameHistoryContext } from '../../state/game-history.store';

const GameScoreHistoryModal = ({ navigation }: PageNavigationProps<typeof RouteName>) => {
    const { gameState, setGameState } = useContext(gameHistoryContext);
    if (!gameState) {
        return (
            <View>
                <Text>No Data To Show</Text>
            </View>
        );
    }
    return (
        <View style={sharedStyles.pageContainer}>
            <NavBar
                rightButton={{ icon: 'window-close', title: 'Close', clickHandler: () => {
                    setGameState(undefined);
                    navigation.pop();
                }}}
            />
            <FlatList
                style={sharedStyles.scroll}
                data={gameState.players}
                renderItem={
                    (itemData) =>
                        <GameScoreListItem
                            key={itemData.item.key}
                            player={itemData.item}
                            playerScoreHistory={gameState.scoreHistory[itemData.item.key]}
                            winning={itemData.item.key === gameState.winningPlayerKey}
                        />
                }
            />
        </View>
    )
}

export const RouteName = 'GameScoreHistoryModal';
export default observer(GameScoreHistoryModal);

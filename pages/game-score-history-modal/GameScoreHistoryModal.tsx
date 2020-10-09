import React, { useContext } from 'react'
import { Text, View } from 'react-native'
import { observer } from 'mobx-react';
import { PageNavigationProps } from '../../navigation';
import NavBar from '../../components/NavBar';
import { sharedStyles } from '../../styles/shared';
import { gameHistoryContext } from '../../state/game-history.store';
import GamePlayerScoresTable from '../game-scores/components/GamePlayerScoresTable';
import GameScoresHeader from '../game-scores/components/GameScoresHeader';

// TODO make this an actual modal

const GameScoreHistoryModal = ({ navigation }: PageNavigationProps<typeof RouteName>) => {
    const { gameState, setGameState, scoreHistoryRounds } = useContext(gameHistoryContext);

    if (!gameState) {
        return (
            <View style={[sharedStyles.column]}>
                <Text style={sharedStyles.centeredContent}>No Data To Show</Text>
            </View>
        );
    }
    return (
        <View style={sharedStyles.pageContainer}>
            <NavBar
                leftButton={{ icon: 'chevron-left', title: 'Back', clickHandler: () => {
                    setGameState(undefined);
                    navigation.pop();
                }}}
                // rightButton={{ icon: 'window-close', title: 'Close', clickHandler: () => {
                //     setGameState(undefined);
                //     navigation.pop();
                // }}}
            />
            <View style={[sharedStyles.column]}>
                <GameScoresHeader gameState={gameState}/>

                <GamePlayerScoresTable
                    players={gameState.players}
                    editable={false}
                    scoreHistory={gameState.scoreHistory}
                    scoreHistoryRounds={scoreHistoryRounds}
                />
            </View>

        </View>
    )
}

export const RouteName = 'GameScoreHistoryModal';
export default observer(GameScoreHistoryModal);

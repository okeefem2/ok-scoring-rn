import React, { useContext } from 'react'
import { Text, View } from 'react-native'
import { observer } from 'mobx-react';
import { GameScoreHistoryRoute, PageNavigationProps } from '../../navigation';
import NavBar from '../../components/NavBar';
import { sharedStyles } from '../../styles/shared';
import { gameHistoryContext } from '../../state/game-history.store';
import GamePlayerScoresTable from '../game-scores/components/GamePlayerScoresTable';
import GameScoresHeader from '../game-scores/components/GameScoresHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const GameScoreHistory = ({ navigation }: PageNavigationProps<typeof GameScoreHistoryRoute>) => {
    const { gameState, setGameState, scoreHistoryRounds, addOrReplacePlayer } = useContext(gameHistoryContext);

    if (!gameState) {
        return (
            <View style={[sharedStyles.column]}>
                <Text style={sharedStyles.centeredContent}>No Data To Show</Text>
            </View>
        );
    }
    return (
        <SafeAreaView style={sharedStyles.pageContainer}>
            <View style={sharedStyles.spacedColumn}>
                <NavBar
                    leftButton={{
                        icon: 'chevron-left', title: 'Back', clickHandler: () => {
                            setGameState(undefined);
                            navigation.pop();
                        }
                    }}
                />
                <GameScoresHeader gameState={gameState} playerUpdated={addOrReplacePlayer} />
                <GamePlayerScoresTable
                    players={gameState.players}
                    editable={false}
                    scoreHistory={gameState.scoreHistory}
                    scoreHistoryRounds={scoreHistoryRounds}
                />
            </View>

        </SafeAreaView>
    );
}

export default observer(GameScoreHistory);

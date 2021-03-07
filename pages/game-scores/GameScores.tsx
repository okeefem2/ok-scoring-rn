import React, { useContext } from 'react'
import { View, Text, TextInput } from 'react-native'
import { sharedStyles } from '../../styles/shared'
import { gameContext } from '../../state/game.store'
import { observer } from 'mobx-react'
import { GameRoute, GameScoresRoute, NewGameRoute, PageNavigationProps } from '../../navigation'
import { gameHistoryContext } from '../../state/game-history.store'
import { playerHistoryContext } from '../../state/players-history.store'
import GamePlayerScoresTable from './components/GamePlayerScoresTable'
import GameScoresHeader from './components/GameScoresHeader'
import GameScoresNavBar from './GameScoresNavBar'
import { SafeAreaView } from 'react-native-safe-area-context';
import PromptModal from '../../components/PromptModal'

export type GameScoreProps = {
    gameOver?: boolean;
}

const GameScores = ({ route: { params: { gameOver } }, navigation }: PageNavigationProps<typeof GameScoresRoute>) => {
    const {
        players,
        gameState,
        initGameState,
        scoreHistory,
        scoreHistoryRounds,
        editingPlayerScore,
        cancelEditPlayerScore,
        updateRoundScore,
        winningPlayerName,
        copyGameSetup,
        settings,
        description,
        addOrReplacePlayer,
    } = useContext(gameContext);
    const { saveGame } = useContext(gameHistoryContext);
    const { savePlayers } = useContext(playerHistoryContext);

    const exitToNewGame = () => {
        initGameState(undefined);
        navigation.reset({
            index: 0,
            routes: [{ name: NewGameRoute }],
        });
    };

    const exitAndplayAgain = () => {
        copyGameSetup(players, settings, description);
        navigation.reset({
            index: 0,
            routes: [{ name: GameRoute }],
        });
    };

    const saveAndQuit = (playAgain: boolean) => {
        savePlayers(gameState.players);
        saveGame(gameState);
        if (playAgain) {
            exitAndplayAgain();
        } else {
            exitToNewGame();
        }
    }

    return (
        <SafeAreaView style={[sharedStyles.pageContainer]}>
            <View style={[sharedStyles.spacedColumn]}>
                <PromptModal
                    modalVisible={!!editingPlayerScore}
                    title={`Update Round ${editingPlayerScore?.scoreIndex ?? 0 + 1} Score For ${editingPlayerScore?.player.name}`}
                    placeHolder='Update Score'
                    keyboardType='number-pad'
                    onCancel={cancelEditPlayerScore}
                    onSave={(value) => {
                        if (value !== undefined && editingPlayerScore) {
                            const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
                            updateRoundScore(editingPlayerScore.player.key, editingPlayerScore.scoreIndex, numericValue);
                        }
                    }} />
                <GameScoresNavBar backHandler={navigation.pop} saveHandler={gameOver ? saveAndQuit : null} winningPlayerName={winningPlayerName} />
                <GameScoresHeader gameState={gameState} playerUpdated={addOrReplacePlayer} />
                <GamePlayerScoresTable
                    players={players}
                    scoreHistory={scoreHistory}
                    scoreHistoryRounds={scoreHistoryRounds}
                    editable={!gameOver}
                />
            </View>
        </SafeAreaView>
    );
}

export default observer(GameScores);

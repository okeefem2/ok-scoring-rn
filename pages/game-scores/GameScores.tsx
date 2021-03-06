import React, { useContext, useState, useEffect } from 'react'
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
        updateRoundScore,
        winningPlayerName,
        copyGameSetup,
        settings,
        description,
        addOrReplacePlayer,
    } = useContext(gameContext);
    const { saveGame } = useContext(gameHistoryContext);
    const { savePlayers } = useContext(playerHistoryContext);

    const [tempNewScore, setTempNewScore] = useState<number>();
    const [playerRoundScoreInputRef, setPlayerRoundScoreInputRef] = useState<TextInput>();

    useEffect(() => {
        if (playerRoundScoreInputRef) {
            playerRoundScoreInputRef.focus();
        }
    }, [playerRoundScoreInputRef]);

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
                <GameScoresNavBar backHandler={navigation.pop} saveHandler={gameOver ? saveAndQuit : null} winningPlayerName={winningPlayerName} />
                <GameScoresHeader gameState={gameState} playerUpdated={addOrReplacePlayer} />
                {
                    editingPlayerScore ? <View style={sharedStyles.spacedRowNoBorder}>
                        <Text style={[sharedStyles.bodyText]}>
                            Update Round {editingPlayerScore.scoreIndex + 1} Score For {editingPlayerScore.player.name}:
                        </Text>
                        <TextInput
                            placeholder='Update Score'
                            onChangeText={(n) => !!n && setTempNewScore(parseInt(n.replace(/[^0-9]/g, ''), 10))}
                            value={tempNewScore?.toString()}
                            autoCorrect={false}
                            returnKeyType="done"
                            clearTextOnFocus={true}
                            ref={(input: TextInput) => setPlayerRoundScoreInputRef(input)}
                            onEndEditing={() => {
                                if (tempNewScore !== undefined) {
                                    updateRoundScore(editingPlayerScore.player.key, editingPlayerScore.scoreIndex, tempNewScore);
                                    setTempNewScore(undefined);
                                }
                            }}
                            keyboardType='number-pad' />
                    </View> : null
                }
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

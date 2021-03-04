import React, { useContext, useState, useEffect } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import NavBar from '../../components/NavBar'
import { sharedStyles } from '../../styles/shared'
import { gameContext } from '../../state/game.store'
import { observer } from 'mobx-react'
import { PageNavigationProps } from '../../navigation'
import { RouteName as NewGameRoute } from '../new-game/NewGame';
import { gameHistoryContext } from '../../state/game-history.store'
import { playerHistoryContext } from '../../state/players-history.store'
import GamePlayerScoresTable from './components/GamePlayerScoresTable'
import GameScoresHeader from './components/GameScoresHeader'
import GameScoresNavBar from './GameScoresNavBar'
import { RouteName as GameRoute } from '../game/Game';
import { SafeAreaView } from 'react-native-safe-area-context';

export type GameScoreProps = {
    gameOver?: boolean;
}

const GameScores = ({ route: { params: { gameOver } }, navigation }: PageNavigationProps<typeof RouteName>) => {
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
    // TODO make a read only view version of this for game history
    // Rename this to game scores or something similar

    return (
        <SafeAreaView style={[sharedStyles.pageContainer]}>
            <View style={[styles.gameScoresContainer]}>
                <View style={[sharedStyles.column]}>
                    <GameScoresNavBar backHandler={navigation.pop} saveHandler={gameOver ? saveAndQuit : null} winningPlayerName={winningPlayerName} />
                    <GameScoresHeader gameState={gameState} playerUpdated={addOrReplacePlayer} />
                    {
                        editingPlayerScore ? <View style={sharedStyles.spacedRowNoBorder}>
                            <Text style={[sharedStyles.bodyText]}>
                                Update Round {editingPlayerScore.scoreIndex + 1} Score For {editingPlayerScore.player.name}:
                                </Text>
                            <TextInput
                                style={[]}
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
                {/* <View style={[{ alignSelf: 'flex-end' }, sharedStyles.mb10]}>
                    {
                        gameOver && <NavBar
                            rightButton={{ icon: 'delete-outline', title: 'Discard & Quit', clickHandler: exitToNewGame }} />
                    }
                </View> */}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    gameScoresContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%'
    },
});

export const RouteName = 'GameScore';
export default observer(GameScores);

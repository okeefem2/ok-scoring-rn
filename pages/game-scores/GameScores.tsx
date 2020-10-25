import React, { useContext, useState, useEffect } from 'react'
import {View, Text, TextInput, StyleSheet} from 'react-native'
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
        updateRoundScore
    } = useContext(gameContext);
    const { saveGame } = useContext(gameHistoryContext);
    const { savePlayers } = useContext(playerHistoryContext);

    const [tempNewScore, setTempNewScore] = useState<number>();
    const [playerRoundScoreInputRef, setPlayerRoundScoreInputRef] = useState<TextInput>();

    useEffect(() => {
        if (playerRoundScoreInputRef) {
            playerRoundScoreInputRef.focus();
        }
    }, [playerRoundScoreInputRef])

    const exitToNewGame = () => {
        initGameState(undefined);
        navigation.reset({
            index: 0,
            routes: [{ name: NewGameRoute }],
        });
    };

    // TODO make a read only view version of this for game history
    // Rename this to game scores or something similar

    return (
        <View style={[sharedStyles.pageContainer]}>
            <View style={[ styles.gameScoresContainer]}>
                <View style={[sharedStyles.column]}>
                    <NavBar
                        leftButton={
                            { icon: 'chevron-left', title: 'Back', clickHandler: navigation.pop }
                        }
                        rightButton={gameOver ? { icon: 'content-save-outline', title: 'Save & Quit', clickHandler: () => {
                            savePlayers(gameState.players);
                            saveGame(gameState);
                            exitToNewGame();
                        } } : undefined}
                    />
                    <GameScoresHeader gameState={gameState}/>
                    {
                        editingPlayerScore ? <View style={sharedStyles.spacedRowNoBorder}>
                                <Text style={[sharedStyles.bodyText]}>
                                    Update Round {editingPlayerScore.scoreIndex + 1} Score For { editingPlayerScore.playerName }:
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
                                            updateRoundScore(editingPlayerScore.playerKey, editingPlayerScore.scoreIndex, tempNewScore);
                                            setTempNewScore(undefined);
                                        }
                                    }}
                                    keyboardType='number-pad'/>
                        </View> : null
                    }
                    <GamePlayerScoresTable
                        players={players}
                        scoreHistory={scoreHistory}
                        scoreHistoryRounds={scoreHistoryRounds}
                    />
                </View>
                <View style={[ { alignSelf: 'flex-end' }]}>
                    {
                        gameOver && <NavBar
                            leftButton={{ icon: 'delete-outline', title: 'Discard & Quit', clickHandler: exitToNewGame }} />
                    }
                </View>
            </View>
        </View>
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

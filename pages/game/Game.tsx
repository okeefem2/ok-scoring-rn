import React, { useState, useEffect, createContext } from 'react'
import { StyleSheet, Text, View, Button, TextInput } from 'react-native'
import { Player } from '../../model/player';
import { Settings } from '../../model/settings';
import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import GameTimer from './GameTimer';
import { sharedStyles } from '../../styles/shared';
import IconButton from '../../components/IconButton';
import ScoreHistory from './ScoreHistory';
import { GameScoreHistory, PlayerScoreHistory, GameState } from '../../model/game-score-history';
import { colors } from '../../styles/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { v4 as uuid } from 'react-native-uuid';
import { useTimerState } from '../../providers/timer';

interface GameProps {
    game?: GameState;
    players: Player[];
    settings: Settings;
    description: string;
    endGame: (game?: GameState) => void;
}

interface ActivePlayerScore {playerScore: PlayerScoreHistory, index: number, player: Player };

export function buildInitialHistory(players: Player[], startingScore: number): GameScoreHistory {
    console.log('setting initial history');
    return players.reduce(
        (history, player) => ({
            ...history,
            [player.key]: {
                currentScore: startingScore,
                winning: false,
                losing: false,
                scores: [],
            }
        }),
        {}
    );
}
const Game = ({players, settings, endGame, game, description}: GameProps) => {
    const {timerValue} = useTimerState();
    const [gameState, setGameState] = useState<GameState | undefined>(game);
    const [showScoreHistory, setShowScoreHistory] = useState<boolean>(false);
    const [gameOver, setGameOver] = useState<boolean>(false);
    // const [showGameSettings, setShowGameSettings] = useState<boolean>(false);
    // const [scoreHistory, updateScoreHistory] = useState<GameScoreHistory>({});
    const [activePlayerScore, setActivePlayerScore] = useState<ActivePlayerScore | undefined>();
    const [turnScore, updateTurnScore] = useState<number>(0);
    const [scoreStep, updateScoreStep] = useState<number | undefined>(settings?.defaultScoreStep || 1);
    const [winningScore, updateWinningScore] = useState<{ playerKey: string, score: number }>({ playerKey: '', score: 0 });
    const [losingScore, updateLosingScore] = useState<{ playerKey: string, score: number }>({ playerKey: '', score: Infinity });

    let scoreStepInputRef: any;
    useEffect(() => {
        let initialScoreHistory: GameScoreHistory;
        if (!game) {
            initialScoreHistory = buildInitialHistory(players, settings.startingScore ?? 0);
            setGameState({
                key: uuid(),
                description,
                date: new Date().toLocaleDateString(),
                scoreHistory: initialScoreHistory,
                players,
            });
        } else {
            initialScoreHistory = game.scoreHistory;
        }
        // updateScoreHistory(initialScoreHistory);
        setActivePlayerScore({
            playerScore: initialScoreHistory[players[0].key],
            player: players[0],
            index: 0,
        });
    }, [players, settings]);

    // TODO make a function to recalc current score
    const reCalcCurrentScore = (scoreHistory: PlayerScoreHistory): PlayerScoreHistory => {
        scoreHistory.currentScore = scoreHistory.scores.reduce((sum, s) => sum + s, 0);
        return scoreHistory;
    }

    const determineWinnerLoser = (gameScoreHistory: GameScoreHistory) => {
        const winningScore = { playerKey: '', score: 0 };
        const losingScore = { playerKey: '', score: Infinity };

        Object.keys(gameScoreHistory).forEach((playerKey: string) => {
            const { currentScore } = gameScoreHistory[playerKey];
            if (currentScore > winningScore.score) {
                winningScore.playerKey = playerKey;
                winningScore.score = currentScore;
            } else if (currentScore < losingScore.score) {
                losingScore.playerKey = playerKey;
                losingScore.score = currentScore;
            }
        });
        updateWinningScore(winningScore);
        updateLosingScore(losingScore);
    }

    const removeRound = (playerKey: string, roundIndex: number) => {
        if (gameState) {
            gameState.scoreHistory[playerKey].scores.splice(roundIndex, 1);
            gameState.scoreHistory[playerKey] = reCalcCurrentScore(gameState?.scoreHistory[playerKey]);
            setGameState(gameState);
            determineWinnerLoser(gameState.scoreHistory);
        }

    };

    const updateRoundScore = (playerKey: string, roundIndex: number, newScore: number) => {
        if (gameState) {
            gameState.scoreHistory[playerKey].scores.splice(roundIndex, 1, newScore);
            gameState.scoreHistory[playerKey] = reCalcCurrentScore(gameState.scoreHistory[playerKey]);
            setGameState(gameState);
            determineWinnerLoser(gameState.scoreHistory);
        }
    };

    const endPlayerTurn = ()  => {
        if (gameState) {
            const { playerScore, player } = activePlayerScore as ActivePlayerScore;
            playerScore.scores.push(turnScore);
            playerScore.currentScore += turnScore;
            gameState.scoreHistory[player.key] = playerScore;
            setGameState(gameState);
            updateScoreStep(settings.defaultScoreStep ?? 1);
            updateTurnScore(0);
            // TODO see if this causes two renders, if it does, just return the new player from this function
            // TO be able to batch the updates
            changePlayer(1);
        }
    }

    const changePlayer = (n: 1 | -1) => {
        if (gameState) {
            const { index } = activePlayerScore as ActivePlayerScore;
            let newIndex = index + n;
            if (newIndex >= players.length) {
                newIndex = 0;
            } else if (newIndex < 0) {
                newIndex = players.length - 1;
            }
            const player = players[newIndex];
            const playerScore = gameState.scoreHistory[players[newIndex].key];

            determineWinnerLoser(gameState.scoreHistory);
            setActivePlayerScore({ playerScore, index: newIndex, player, });
        }
    }

    if (showScoreHistory && gameState?.scoreHistory) {
        return (
            <ScoreHistory
                players={players}
                scoreHistory={gameState.scoreHistory}
                exitScoreHistory={() => setShowScoreHistory(false)}
                updateRoundScore={updateRoundScore}
                removeRound={removeRound}
                winningPlayerKey={winningScore.playerKey}
                losingPlayerKey={losingScore.playerKey}
            />
        );
    }

    if (gameOver && gameState) {
        return (
            <ScoreHistory
                players={players}
                scoreHistory={gameState.scoreHistory}
                exitScoreHistory={(keepGame?: boolean) => {
                    endGame(keepGame ? {
                        winningPlayerKey: winningScore.playerKey,
                        ...gameState
                    } : undefined)
                }}
                winningPlayerKey={winningScore.playerKey}
                losingPlayerKey={losingScore.playerKey}
                gameOver={true}
            />
        );
    }

    return ( activePlayerScore ?
            <View style={styles.gameContainer}>
                    <NavBar
                        leftButton={{ icon: 'book', title: 'Scores', clickHandler: () => setShowScoreHistory(true)}}
                        rightButton={{ icon: 'exit-to-app', title: 'Finish Game', clickHandler: () => {
                            setGameState({ ...gameState as GameState, duration: timerValue });
                            setGameOver(true);
                        }}}
                    />
                    <View style={[sharedStyles.centeredContent, sharedStyles.mt25 ]}>
                        {
                            winningScore.playerKey === activePlayerScore.player.key &&
                                <MaterialCommunityIcons name='crown' size={28} color={colors.tertiary} />
                        }
                    </View>
                    <View style={[sharedStyles.spacedEvenlyNoBorder, winningScore.playerKey !== activePlayerScore.player.key && sharedStyles.mt25 ]}>
                        <View style={[styles.buttonRowItem]}>
                            <IconButton icon='chevron-left' clickHandler={() => changePlayer(-1)} width={'100%'} />
                        </View>
                        <View style={[styles.buttonRowItem]}>
                            <Header title={activePlayerScore.player.name}/>
                        </View>
                        <View style={[styles.buttonRowItem]}>
                        <IconButton icon='chevron-right' clickHandler={() => changePlayer(1)} width={'100%'} />
                        </View>
                    </View>
                    {/* <View style={sharedStyles.spacedEvenlyNoBorder}>
                        <IconButton icon='chevron-left' clickHandler={() => changePlayer(-1)} width={'100%'} />
                        <GameTimer />
                        <IconButton icon='chevron-right' clickHandler={() => changePlayer(1)} width={'100%'} />
                    </View> */}
                    {/* <View style={[sharedStyles.centeredContent, sharedStyles.mb25]}>
                        <Header title={activePlayerScore.player.name}/>
                    </View> */}
                    <View style={styles.scoreContainer}>
                        <View style={styles.middleTextOuter}>
                            <Text style={[styles.turnDetails, styles.turnNumber]}>
                                Turn {activePlayerScore.playerScore.scores.length + 1}
                            </Text>
                        </View>
                        <View style={styles.middleTextInner}>
                            <Text style={[sharedStyles.headerText, sharedStyles.centeredText]}>
                                {activePlayerScore.playerScore.currentScore?.toString() || '0'}
                            </Text>
                        </View>

                        <View style={styles.middleTextOuter}>
                            <Text style={[styles.turnDetails, styles.turnScore ]}>
                                { turnScore >= 0 ? `+${turnScore}` : turnScore} points
                            </Text>
                        </View>
                    </View>
                    <View style={[sharedStyles.spacedEvenlyNoBorder, sharedStyles.mt25 ]}>
                        <View style={[styles.buttonRowItem]}>
                            <IconButton icon='minus' clickHandler={() => scoreStep && updateTurnScore(turnScore - scoreStep)} disabled={!scoreStep} width={'100%'}/>
                        </View>
                        <View style={[styles.buttonRowItem]}>
                            <TextInput
                                style={[styles.scoreInput]}
                                onChangeText={(n) => !!n && updateScoreStep(parseInt(n.replace(/[^0-9]/g, ''), 10))}
                                placeholder='Score Step'
                                value={scoreStep?.toString()}
                                keyboardType='number-pad'
                                clearTextOnFocus={true}
                                returnKeyType="done"
                                ref={(input) => { scoreStepInputRef = input; }}
                            />
                            <View style={sharedStyles.mt25}>
                                <IconButton icon='dialpad' clickHandler={() => scoreStepInputRef.focus()} />
                            </View>
                        </View>
                        <View style={[styles.buttonRowItem]}>
                            <IconButton icon='plus' clickHandler={() => scoreStep && updateTurnScore(turnScore + (scoreStep))} disabled={!scoreStep} width={'100%'}/>
                        </View>
                    </View>
                    <View style={[sharedStyles.centeredContent, sharedStyles.mt25]}>
                        <Button title={`End Turn ${activePlayerScore.playerScore.scores.length + 1}`} onPress={endPlayerTurn} color={colors.primary}/>
                    </View>
            </View>
        : <Text>Loading...</Text>
    );
};

export default Game;

const styles = StyleSheet.create({
    buttonRowItem: {
        flex: 1
    },
    gameContainer: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        height: '100%',
        width: '100%'
    },
    scoreInput: {
        fontFamily: 'Quicksand',
        fontSize: 20,
        borderBottomColor: colors.greyMid,
        borderBottomWidth: 1,
        textAlign: 'center',
        minWidth: 50,
    },
    turnNumber: {
        // alignSelf: 'flex-end'
    },
    turnScore: {
        // alignSelf: 'flex-start'
    },
    turnDetails: {
        fontFamily: 'Quicksand',
        fontSize: 18,
        color: colors.primary,
        alignSelf: 'center'
    },
    scoreContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 25,
        marginBottom: 25,
    },
    middleTextInner: {
        flex: 1,
    },
    middleTextOuter: {
        flex: 2,
    },
});

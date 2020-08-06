import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button, TextInput } from 'react-native'
import { Player } from '../../model/player';
import { Settings } from '../../model/settings';
import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import GameTimer from './GameTimer';
import { sharedStyles } from '../../styles/shared';
import IconButton from '../../components/IconButton';
import ScoreHistory from './ScoreHistory';
import { GameScoreHistory, PlayerScoreHistory } from '../../model/game-score-history';
import { colors } from '../../styles/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { share } from 'rxjs/operators';

interface GameProps {
    players: Player[];
    settings: Settings;
    endGame: () => void;
}

interface ActivePlayerScore {playerScore: PlayerScoreHistory, index: number, player: Player };

function buildInitialHistory(players: Player[], startingScore: number): GameScoreHistory {
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
const Game = ({players, settings, endGame}: GameProps) => {
    const [showScoreHistory, setShowScoreHistory] = useState<boolean>(false);
    const [showGameSettings, setShowGameSettings] = useState<boolean>(false);
    const [scoreHistory, updateScoreHistory] = useState<GameScoreHistory>({});
    const [activePlayerScore, setActivePlayerScore] = useState<ActivePlayerScore | undefined>();
    const [turnScore, updateTurnScore] = useState<number>(0);
    const [scoreStep, updateScoreStep] = useState<number | undefined>(settings?.defaultScoreStep || 1);
    const [winningScore, updateWinningScore] = useState<{ playerKey: string, score: number }>({ playerKey: '', score: 0 });
    const [losingScore, updateLosingScore] = useState<{ playerKey: string, score: number }>({ playerKey: '', score: Infinity });

    let scoreStepInputRef: any;
    useEffect(() => {
        const initialScoreHistory = buildInitialHistory(players, settings.startingScore ?? 0)
        updateScoreHistory(initialScoreHistory);
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
        scoreHistory[playerKey].scores.splice(roundIndex, 1);
        scoreHistory[playerKey] = reCalcCurrentScore(scoreHistory[playerKey]);
        updateScoreHistory(scoreHistory);
        determineWinnerLoser(scoreHistory);
    };

    const updateRoundScore = (playerKey: string, roundIndex: number, newScore: number) => {
        scoreHistory[playerKey].scores.splice(roundIndex, 1, newScore);
        scoreHistory[playerKey] = reCalcCurrentScore(scoreHistory[playerKey]);
        updateScoreHistory(scoreHistory);
        determineWinnerLoser(scoreHistory);
    };

    const endPlayerTurn = ()  => {
        const { playerScore, player } = activePlayerScore as ActivePlayerScore;
        playerScore.scores.push(turnScore);
        playerScore.currentScore += turnScore;
        scoreHistory[player.key] = playerScore;
        updateScoreHistory(scoreHistory);
        updateScoreStep(settings.defaultScoreStep ?? 1);
        updateTurnScore(0);
        // TODO see if this causes two renders, if it does, just return the new player from this function
        // TO be able to batch the updates
        changePlayer(1);
    }

    const changePlayer = (n: 1 | -1) => {
        const { index } = activePlayerScore as ActivePlayerScore;
        let newIndex = index + n;
        if (newIndex >= players.length) {
            newIndex = 0;
        } else if (newIndex < 0) {
            newIndex = players.length - 1;
        }
        const player = players[newIndex];
        const playerScore = scoreHistory[players[newIndex].key];

        determineWinnerLoser(scoreHistory);
        setActivePlayerScore({ playerScore, index: newIndex, player, });
    }

    if (showScoreHistory) {
        return (
            <ScoreHistory
                players={players}
                scoreHistory={scoreHistory}
                exitScoreHistory={() => setShowScoreHistory(false)}
                updateRoundScore={updateRoundScore}
                removeRound={removeRound}
                winningPlayerKey={winningScore.playerKey}
                losingPlayerKey={losingScore.playerKey}
            />
        );
    }

    return ( activePlayerScore ?
        <View style={styles.gameContainer}>
            <View>
                <View>
                    <NavBar
                        leftButton={{ icon: 'book', title: 'Scores', clickHandler: () => setShowScoreHistory(true)}}
                        rightButton={{ icon: 'exit-to-app', title: 'Finish Game', clickHandler: endGame}}
                    />
                </View>
                <View style={sharedStyles.rowNoBorder}>
                    <IconButton icon='chevron-left' clickHandler={() => changePlayer(-1)} />
                    <GameTimer />
                    <IconButton icon='chevron-right' clickHandler={() => changePlayer(1)} />
                </View>
                {
                    winningScore.playerKey === activePlayerScore.player.key &&
                    <View style={sharedStyles.centeredContent}>
                        <MaterialCommunityIcons name='crown' size={28} color={colors.tertiary} />
                    </View>
                }
                <View style={sharedStyles.centeredContent}>
                    <Header title={activePlayerScore.player.name}/>
                </View>
                {/* <View style={sharedStyles.rowNoBorder}> */}
                    {/* <View style={sharedStyles.centeredContent}> */}
                        <View style={styles.scoreContainer}>
                            <View style={styles.middleTextOuter}>
                            {/* <Text style={styles.turnScore}>
                                    current
                                </Text> */}
                            </View>
                            {/* <Header title={activePlayerScore.playerScore.currentScore?.toString() || '0'}/> */}
                            <View style={styles.middleTextInner}>
                                <Text style={[sharedStyles.headerText, sharedStyles.centeredText]}>
                                    {activePlayerScore.playerScore.currentScore?.toString() || '0'}
                                </Text>
                            </View>

                            <View style={styles.middleTextOuter}>
                                <Text style={styles.turnScore}>
                                    { turnScore >= 0 ? `+${turnScore}` : turnScore} points
                                </Text>
                            </View>




                        {/* </View> */}
                    {/* </View> */}
                </View>
                <View style={[sharedStyles.rowNoBorder, sharedStyles.mt25]}>
                    <IconButton icon='minus' clickHandler={() => scoreStep && updateTurnScore(turnScore - scoreStep)} disabled={!scoreStep} />
                    <View>
                        <TextInput
                            style={styles.scoreInput}
                            onChangeText={(n) => updateScoreStep(n ? parseInt(n.replace(/[^0-9]/g, ''), 10) : undefined)}
                            placeholder='Score Step'
                            value={scoreStep?.toString()}
                            keyboardType='number-pad'
                            ref={(input) => { scoreStepInputRef = input; }}
                        />
                        <View style={sharedStyles.mt25}>
                            <IconButton icon='dialpad' clickHandler={() => scoreStepInputRef.focus()} />
                        </View>
                    </View>
                    <IconButton icon='plus' clickHandler={() => scoreStep && updateTurnScore(turnScore + (scoreStep))} disabled={!scoreStep} />
                </View>

                <View style={[sharedStyles.centeredContent, sharedStyles.mt25]}>
                    <Button title={`End Turn ${activePlayerScore.playerScore.scores.length + 1}`} onPress={endPlayerTurn} color={colors.primary}/>
                </View>
            </View>

            <View>
                <NavBar
                    leftButton={{ icon: 'settings', title: 'Game Settings', clickHandler: () => console.log('game settings')}}
                />
            </View>
        </View> : <Text>Loading...</Text>
    );
};

export default Game;

const styles = StyleSheet.create({
    gameContainer: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        height: '100%',
        width: '100%',
        justifyContent: 'space-between',
    },
    scoreInput: {
        fontFamily: 'Quicksand',
        fontSize: 20,
        borderBottomColor: colors.greyMid,
        borderBottomWidth: 1,
        textAlign: 'center',
        minWidth: 50,
    },
    turnScore: {
        fontFamily: 'Quicksand',
        fontSize: 18,
        color: colors.primary
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

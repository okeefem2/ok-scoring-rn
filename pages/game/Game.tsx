import React, { useEffect, useState, useContext, useRef } from 'react'
import { StyleSheet, Text, View, TextInput, Animated } from 'react-native'
import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import { sharedStyles } from '../../styles/shared';
import IconButton from '../../components/IconButton';
import { colors } from '../../styles/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { gameContext } from '../../state/game.store';
import { observer } from 'mobx-react';
import { PageNavigationProps } from '../../navigation';
import { RouteName as GameScoresRoute } from '../game-scores/GameScores';

const Game = ({ navigation }: PageNavigationProps<typeof RouteName>) => {
    const {
        settings,
        players,
        startGame,
        activePlayerScore,
        winningPlayerKey,
        changeActivePlayer,
        endPlayerTurn,
    } = useContext(gameContext);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const runFadeAnimation = () => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    }

    let turnScoreInputRef: TextInput;
    useEffect(() => {
        startGame();
        runFadeAnimation();
    }, []);

    const [turnScore, updateTurnScore] = useState<number | undefined>(settings?.defaultScoreStep ?? 0);

    return ( activePlayerScore ?
        <View style={sharedStyles.pageContainer}>
            <View style={styles.gameContainer}>
                    <NavBar
                        leftButton={{ icon: 'book', title: 'Scores', clickHandler: () => {
                            navigation.navigate(GameScoresRoute, { gameOver: false });
                        }}}
                        rightButton={{ icon: 'exit-to-app', title: 'Finish Game', clickHandler: () => {
                            navigation.navigate(GameScoresRoute, { gameOver: true });
                        }}}
                    />
                    <View style={[sharedStyles.centeredContent, sharedStyles.mt25 ]}>
                        {
                            winningPlayerKey === activePlayerScore.player.key &&
                            <Animated.View style={[{ opacity: fadeAnim }]}>
                                <MaterialCommunityIcons name='crown' size={28} color={colors.tertiary} />
                            </Animated.View>
                        }
                    </View>
                    <View style={[sharedStyles.spacedEvenlyNoBorder, winningPlayerKey !== activePlayerScore.player.key && sharedStyles.mt25 ]}>
                        <View style={[styles.buttonRowItem]}>
                            <IconButton icon='chevron-left' clickHandler={() => {
                                changeActivePlayer(-1, players);
                                runFadeAnimation();
                            }} width={'100%'} size={34} />
                        </View>
                        <Animated.View style={[styles.buttonRowItem, { opacity: fadeAnim }]}>
                            <Header title={activePlayerScore.player.name}/>
                        </Animated.View>
                        <View style={[styles.buttonRowItem]}>
                            <IconButton icon='chevron-right' clickHandler={() => {
                                changeActivePlayer(1, players);
                                runFadeAnimation();
                            }} width={'100%'} size={34} />
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
                    <Animated.View style={[{ opacity: fadeAnim }]}>
                        <Text style={[styles.turnDetails, sharedStyles.mt15]}>
                            Turn {activePlayerScore.playerScore.scores.length + 1}
                        </Text>
                    </Animated.View>
                    <Animated.View style={[styles.scoreContainer, { opacity: fadeAnim }]}>
                        <View style={styles.middleTextInner}>
                            <Text style={[sharedStyles.headerText, sharedStyles.centeredText]}>
                                {activePlayerScore.playerScore.currentScore?.toString() || '0'}
                            </Text>
                        </View>
                    </Animated.View>
                    <View style={[sharedStyles.spacedEvenlyNoBorder, sharedStyles.mt10 ]}>
                        <View style={[styles.buttonRowItem]}>
                            <IconButton icon='plus-minus' clickHandler={() => turnScore && updateTurnScore(turnScore * -1)} size={34}/>
                        </View>
                        <View style={[ styles.buttonRowItem ]}>
                            <TextInput
                                style={[styles.scoreInput]}
                                onChangeText={(n) => {
                                    if (!!n || n === '0') {
                                        updateTurnScore(parseInt(n.replace(/[^0-9]/g, ''), 10));
                                    } else {
                                        updateTurnScore(undefined);
                                    }
                                }}
                                placeholder='Turn Score'
                                value={turnScore?.toString()}
                                clearTextOnFocus={true}
                                keyboardType='number-pad'
                                returnKeyType="done"
                                ref={(input: TextInput) => { turnScoreInputRef = input; }}
                            />
                            <View style={sharedStyles.mt25}>
                                <IconButton icon='dialpad' clickHandler={() => turnScoreInputRef.focus()} size={34} />
                            </View>
                        </View>
                        <View style={[styles.buttonRowItem]}>
                        </View>
                    </View>
                    <View style={[sharedStyles.centeredContent, sharedStyles.mt25]}>
                        <Text style={[styles.turnDetails]}>
                            { !!turnScore ? (turnScore >= 0 ? `+${turnScore}` : turnScore) : '+0'} points
                        </Text>
                    </View>
                    <View style={[sharedStyles.centeredContent, sharedStyles.mt25]}>
                        <IconButton title={`End Turn`} clickHandler={() => {
                            endPlayerTurn(turnScore, players);
                            updateTurnScore(settings?.defaultScoreStep ?? 0);
                            runFadeAnimation();
                        }}/>
                    </View>
                </View>
            </View>
        : <Text>Loading...</Text>
    );
};

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
    turnDetails: {
        fontFamily: 'Quicksand',
        fontSize: 18,
        color: colors.tertiary,
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
    scoreInputContainer: {
        width: '40%',
    }
});

export const RouteName = 'Game';
export default observer(Game);

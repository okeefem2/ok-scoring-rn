import React, { useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Animated } from 'react-native'
import { sharedStyles } from '../../../styles/shared';
import GamePlayerScoresTableRow from './GamePlayerScoresTableRow';
import { Player } from '../../../model/player';
import { GameScoreHistory } from '../../../model/game-score-history';

type GamePlayerScoresTableProps = {
    players: Player[],
    scoreHistoryRounds: number[],
    scoreHistory: GameScoreHistory,
    editable: boolean
}
const scrollPosition = new Animated.Value(0);
const scrollEvent = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollPosition } } }],
    { useNativeDriver: false },
);
let roundScrollRef: ScrollView;

const GamePlayerScoresTable = ({
    players, scoreHistoryRounds, scoreHistory, editable = true
}: GamePlayerScoresTableProps) => {
    useEffect(() => {
        scrollPosition.addListener(position => {
            roundScrollRef.scrollTo({ x: position.value, animated: false });
        });
        return () => {
            scrollPosition.removeAllListeners();
        }
    }, [scoreHistory]);
    return (
        <>
            <View style={[sharedStyles.plainRow]}>
                <View style={[styles.players]}>
                    <View style={sharedStyles.plainRowBordered}>
                        <Text style={[sharedStyles.scoreTabelLabel]}>
                            Rounds
                        </Text>
                    </View>
                </View>
                <View style={styles.scores}>
                    <ScrollView
                        horizontal={true}
                        ref={(scrollViewRef: ScrollView) => roundScrollRef = scrollViewRef}
                        scrollEnabled={false}
                        scrollEventThrottle={16}
                    >
                        <View style={sharedStyles.plainRowBordered}>
                                {
                                    scoreHistoryRounds.map(
                                        r =>
                                            <Text style={[sharedStyles.scoreTabelCell]} key={r}>
                                                {r}
                                            </Text>
                                    )
                                }
                        </View>
                    </ScrollView>
                </View>
            </View>
            <ScrollView>
                <View style={[sharedStyles.plainRow]}>
                    <View style={[styles.players]}>
                        {
                            players.map(player => (
                                <View style={[sharedStyles.plainRow, sharedStyles.mb5, sharedStyles.mt5]} key={player.key}>
                                    <Text style={[sharedStyles.bodyText]}>
                                        {player.name}
                                    </Text>
                                </View>
                            ))
                        }
                    </View>
                    <View style={styles.scores}>
                        <ScrollView
                            horizontal={true}
                            onScroll={scrollEvent}
                            scrollEventThrottle={16}
                        >
                            <View style={sharedStyles.column}>
                                {
                                    players.map(
                                        player => <GamePlayerScoresTableRow
                                            editable={editable}
                                            playerScoreHistory={scoreHistory[player.key]}
                                            key={player.key} />
                                    )
                                }
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

export default GamePlayerScoresTable;

const styles = StyleSheet.create({
    table: {
        display: 'flex',
        flexDirection: 'row',
    },
    players: {
        flex: 1
    },
    scores: {
        flex: 4
    }
});

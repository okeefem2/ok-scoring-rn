import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
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
const GamePlayerScoresTable = ({
    players, scoreHistoryRounds, scoreHistory, editable = true
}: GamePlayerScoresTableProps) => {
    return (
        <>
            <View style={[sharedStyles.plainRow]}>
                <View style={[styles.players]}></View>
                <View style={styles.scores}>
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
                </View>
            </View>
            <ScrollView>
                <View style={[sharedStyles.plainRow]}>
                    <View style={[styles.players]}>
                        {
                            players.map(player => (
                                <View style={[sharedStyles.plainRow, sharedStyles.mb5, sharedStyles.mt5]}>
                                    <Text style={[sharedStyles.bodyText]}>
                                        {player.name}
                                    </Text>
                                </View>
                            ))
                        }
                    </View>
                    <View style={styles.scores}>
                        <ScrollView horizontal={true}>
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

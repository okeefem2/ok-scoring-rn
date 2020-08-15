import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import IconButton from '../../components/IconButton';
import { Player } from '../../model/player';
import { PlayerScoreHistory } from '../../model/game-score-history';
import { sharedStyles } from '../../styles/shared';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import ScoreHistoryListItemRound from './ScoreHistoryListItemRound';

interface ScoreHistoryListItemProps {
    player: Player;
    playerScoreHistory: PlayerScoreHistory;
    updateRoundScore?: (playerKey: string, roundIndex: number, newScore: number) => void;
    removeRound?: (playerKey: string, roundIndex: number) => void;
    winning: boolean;
}
const ScoreHistoryListItem = ({player, playerScoreHistory, updateRoundScore, removeRound, winning }: ScoreHistoryListItemProps) => {
    return (
        <View style={sharedStyles.spacedRowBordered}>
            <View style={sharedStyles.column}>
                <View style={sharedStyles.spacedRowNoBorder}>
                    <View style={sharedStyles.rowGroup}>
                        {
                            winning && <MaterialCommunityIcons name='crown' size={28} color={colors.tertiary} />
                        }
                        <Text style={[sharedStyles.bodyText, sharedStyles.ml5]} >{player.name}</Text>
                    </View>
                    <View>
                        <Text style={[sharedStyles.bodyText, sharedStyles.ml5]}>{playerScoreHistory.currentScore} points</Text>

                    </View>
                </View>
                <View style={styles.roundsRow}>
                    {
                        playerScoreHistory.scores.map((s, i) =>
                            <ScoreHistoryListItemRound
                                score={s}
                                round={i + 1}
                                updateRoundScore={updateRoundScore && ((newScore: number) => updateRoundScore(player.key, i, newScore))}
                                removeRound={removeRound && (() => removeRound(player.key, i))}
                            />
                        )
                    }
                </View>
            </View>
        </View>
    );
}

export default ScoreHistoryListItem;

const styles = StyleSheet.create({
    roundsRow: {
        marginLeft: 20,
    }
});

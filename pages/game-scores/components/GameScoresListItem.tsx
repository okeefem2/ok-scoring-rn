import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import IconButton from '../../../components/IconButton';
import { Player } from '../../../model/player';
import { sharedStyles } from '../../../styles/shared';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../styles/colors';
import GameScoreListItemRound from './GameScoreListItemRound';
import { PlayerScoreHistory } from '../../../model/player-score-history';

interface GameScoreListItemProps {
    player: Player;
    playerScoreHistory: PlayerScoreHistory;
    winning: boolean;
}
const GameScoreListItem = ({player, playerScoreHistory, winning }: GameScoreListItemProps) => {
    return (
        <View style={sharedStyles.spacedRowNoBorder} key={player.key}>
            <View style={sharedStyles.rowGroup}>
                        {
                            winning && <MaterialCommunityIcons name='crown' size={28} color={colors.tertiary} />
                        }
                        <Text style={[sharedStyles.bodyText, sharedStyles.ml5]} >{player.name}</Text>
                    </View>
                    <View>
                        <Text style={[sharedStyles.bodyText, sharedStyles.ml5]}>{playerScoreHistory.currentScore} points</Text>

                    </View>
            {/* <View style={sharedStyles.column}>
                <View style={sharedStyles.spacedRowNoBorder}>

                </View>
                <View style={styles.roundsRow}>
                    {
                        playerScoreHistory.scores.map((s, i) =>
                            <GameScoreListItemRound
                                key={`${player.key} ${s} ${i + 1}`}
                                score={s}
                                round={i + 1}
                                updateRoundScore={updateRoundScore && ((newScore: number) => updateRoundScore(player.key, i, newScore))}
                                removeRound={removeRound && (() => removeRound(player.key, i))}
                            />
                        )
                    }
                </View>
            </View> */}
        </View>
    );
}

export default GameScoreListItem;

const styles = StyleSheet.create({
    roundsRow: {
        marginLeft: 20,
    }
});

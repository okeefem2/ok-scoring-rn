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
    updateRoundScore: (playerKey: string, roundIndex: number, newScore: number) => void;
    removeRound: (playerKey: string, roundIndex: number) => void;
    winning: boolean;
    losing: boolean;
}
const ScoreHistoryListItem = ({player, playerScoreHistory, updateRoundScore, removeRound, winning, losing }: ScoreHistoryListItemProps) => {
    console.log(playerScoreHistory);
    const [showHistory, setShowHistory] = useState(false);

    return (
        <View style={sharedStyles.row}>
            <View style={sharedStyles.column}>
                <View style={sharedStyles.rowNoBorder}>
                    <View style={sharedStyles.rowGroup}>
                        {
                            winning && <MaterialCommunityIcons name='crown' size={28} color={colors.tertiary} />
                        }
                        <Text style={[sharedStyles.bodyText, sharedStyles.ml5]} >{player.name}</Text>
                    </View>
                    <View>
                        <Text style={[sharedStyles.bodyText, sharedStyles.ml5]}>{playerScoreHistory.currentScore} points</Text>

                        {/* <IconButton icon={showHistory ? 'chevron-up' : 'chevron-down'} size={28} clickHandler={() => setShowHistory(!showHistory)} /> */}
                    </View>
                </View>
                <View style={styles.roundsRow}>
                    {
                        // showHistory &&
                        playerScoreHistory.scores.map((s, i) =>
                            <ScoreHistoryListItemRound
                                score={s}
                                round={i + 1}
                                updateRoundScore={(newScore: number) => updateRoundScore(player.key, i, newScore)}
                                removeRound={() => removeRound(player.key, i)}
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

import React from 'react'
import { Text, View } from 'react-native'
import { Player } from '../../../model/player';
import { sharedStyles } from '../../../styles/shared';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../styles/colors';
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
                <Text style={[sharedStyles.bodyText, sharedStyles.mr5]} >{player.name}</Text>
                {
                    winning && <MaterialCommunityIcons name='crown' size={28} color={colors.tertiary} />
                }
            </View>
            <View>
                <Text style={[sharedStyles.bodyText, sharedStyles.ml5]}>{playerScoreHistory.currentScore} points</Text>
            </View>
        </View>
    );
}

export default GameScoreListItem;

import React, { useContext } from 'react'
import { Text, View } from 'react-native'
import { Player } from '../../../model/player';
import { sharedStyles } from '../../../styles/shared';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../styles/colors';
import { PlayerScoreHistory } from '../../../model/player-score-history';
import { playerHistoryContext } from '../../../state/players-history.store';
import IconButton from '../../../components/IconButton';

interface GameScoreListItemProps {
    player: Player;
    playerScoreHistory: PlayerScoreHistory;
    winning: boolean;
    playerUpdated: (p: Player) => void;
}
const GameScoreListItem = ({player, playerScoreHistory, winning, playerUpdated }: GameScoreListItemProps) => {
    const { toggleFavoriteForPlayer } = useContext(playerHistoryContext);

    const toggleFavorite = () => {
        const newPlayer = toggleFavoriteForPlayer(player);
        playerUpdated(newPlayer);
    }
    return (
        <View style={sharedStyles.spacedRowNoBorder} key={player.key}>
            <View style={sharedStyles.rowGroup}>
                <IconButton size={28} clickHandler={toggleFavorite} icon={player.favorite ? 'star' : 'star-outline'} />
                <Text style={[sharedStyles.bodyText, sharedStyles.mr5]}>{player.name}</Text>
                {
                    winning && <MaterialCommunityIcons name='crown' size={28} color={colors.tertiary} />
                }
            </View>
            <View>
                <Text style={[sharedStyles.bodyText, sharedStyles.ml5]}>{playerScoreHistory?.currentScore ?? 0} points</Text>
            </View>
        </View>
    );
}

export default GameScoreListItem;

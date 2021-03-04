import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { Player } from '../../../../model/player';
import { sharedStyles } from '../../../../styles/shared';
import IconButton from '../../../../components/IconButton';
import { colors } from '../../../../styles/colors';
import { playerHistoryContext } from '../../../../state/players-history.store';
import { gameContext } from '../../../../state/game.store';

interface PlayerListItemProps {
    player: Player,
    onDeletePlayer: (playerKey: string) => void
    onShiftPlayer: (playerKey: string, direction: 1 | -1) => void
}

function PlayerListItem({ player, onDeletePlayer, onShiftPlayer }: PlayerListItemProps) {
    const { toggleFavoriteForPlayer } = useContext(playerHistoryContext);
    const { addOrReplacePlayer } = useContext(gameContext);

    const toggleFavorite = () => {
        toggleFavoriteForPlayer(player);
        addOrReplacePlayer({ ...player, favorite: !player.favorite });
    }
    return (
        <View style={sharedStyles.spacedRowBordered}>
            <View style={sharedStyles.rowGroup}>
                <IconButton icon="trash-can-outline" color={colors.tertiary} clickHandler={() => onDeletePlayer(player.key)} />
                <Text style={[sharedStyles.bodyText, sharedStyles.ml5]} >{player.name}</Text>
                <IconButton size={28} clickHandler={toggleFavorite} icon={player.favorite ? 'star' : 'star-outline'} />
            </View>
            <View>
                <IconButton icon="chevron-up" size={28} clickHandler={() => onShiftPlayer(player.key, -1)} />
                <IconButton icon="chevron-down" size={28} clickHandler={() => onShiftPlayer(player.key, 1)} />
            </View>
        </View>
    );
}

export default PlayerListItem;

import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity } from 'react-native'
import { Player } from '../../model/player';
import { sharedStyles } from '../../styles/shared';

interface PlayerListItemProps {
    player: Player,
    onDeletePlayer: (playerKey: string) => void
}

function PlayerListItem({ player, onDeletePlayer }: PlayerListItemProps) {
    return (
        <TouchableOpacity onLongPress={() => onDeletePlayer(player.key)}>
            <View style={sharedStyles.row}>
                <Text>{player.name}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default PlayerListItem;

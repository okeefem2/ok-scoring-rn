import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Player } from '../../model/player';
import { sharedStyles } from '../../styles/shared';
import IconButton from '../../components/IconButton';

interface PlayerListItemProps {
    player: Player,
    onDeletePlayer: (playerKey: string) => void
}

function PlayerListItem({ player, onDeletePlayer }: PlayerListItemProps) {
    return (
        <View style={sharedStyles.row}>
            <View style={styles.leftGroup}>
                <IconButton icon="trash-can-outline" clickHandler={() => onDeletePlayer(player.key)} />
                <Text style={styles.playerName} >{player.name}</Text>
            </View>
            <IconButton icon="menu" clickHandler={() => console.log('menu click')} />
        </View>
    );
}

export default PlayerListItem;

const styles = StyleSheet.create({
    leftGroup: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerName: {
        marginLeft: 5,
        fontFamily: 'Quicksand'
    }
});

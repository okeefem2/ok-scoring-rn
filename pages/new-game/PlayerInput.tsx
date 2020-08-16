import React, { useState } from 'react'
import { sharedStyles } from '../../styles/shared'
import { View, TextInput, Button, StyleSheet, Keyboard } from 'react-native'
import IconButton from '../../components/IconButton';
import { Player } from '../../model/player';
import { v4 as uuid } from 'react-native-uuid';
import ModalSelector from 'react-native-modal-selector';
import { colors } from '../../styles/colors';

interface PlayerInputProps {
    onAddPlayer: (player: Player) => void,
    selectablePlayers?: Player[];
}

function PlayerInput({ onAddPlayer, selectablePlayers }: PlayerInputProps) {
    const [newPlayer, setNewPlayer] = useState<Partial<Player>>();

    const addPlayer = () => {
        if (!newPlayer) {
            return;
        }
        if (!newPlayer.key) {
            newPlayer.key = uuid();
        }
        onAddPlayer(newPlayer as Player);
        setNewPlayer(undefined);
        Keyboard.dismiss();
    }

    return (
        <>
            <View style={sharedStyles.spacedRowBordered}>
                <TextInput style={sharedStyles.bodyText} placeholder='New Player' onChangeText={(name) => setNewPlayer({ name })} value={newPlayer?.name}/>
            </View>
            <View style={sharedStyles.spacedRowNoBorder}>
                <View style={styles.addButton}>
                    <IconButton icon={'account'} title={'Add Player'} clickHandler={addPlayer} iconSide='left'/>
                </View>
                {
                    selectablePlayers?.length ?
                    <ModalSelector
                        selectTextStyle={{ color: colors.primary }}
                        optionTextStyle={{ color: colors.secondary }}
                        cancelTextStyle={{ color: colors.tertiary }}
                        selectedKey={newPlayer?.name}
                        data={selectablePlayers}
                        initValue="Select A Player"
                        onChange={(player: Player) => setNewPlayer(player)}
                        keyExtractor= {player => player.key}
                        labelExtractor= {player => player.name}
                    />
                    : <></>
                }
            </View>
        </>
    );
}

export default PlayerInput;

const styles = StyleSheet.create({
    addButton: {
        margin: 0,
        padding: 15,
    },
});

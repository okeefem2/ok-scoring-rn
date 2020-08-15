import React, { useState } from 'react'
import { sharedStyles } from '../../styles/shared'
import { View, TextInput, Button, StyleSheet, Keyboard } from 'react-native'
import IconButton from '../../components/IconButton';
import { Player } from '../../model/player';
import { v4 as uuid } from 'react-native-uuid';
import {Picker} from '@react-native-community/picker';

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
        console.log('Adding player!');
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
                        <Picker
                            selectedValue={newPlayer?.key}
                            style={{ height: 50, width: 50 }}
                            onValueChange={(key) => setNewPlayer(selectablePlayers.find(p => p.key === key))}
                        >
                            {
                                selectablePlayers.map(p => (
                                    <Picker.Item label={p.name} value={p.key} key={p.key}/>
                                ))
                            }
                        </Picker>
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

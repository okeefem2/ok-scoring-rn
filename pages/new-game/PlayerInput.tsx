import React, { useState } from 'react'
import { sharedStyles } from '../../styles/shared'
import { View, TextInput, Button, StyleSheet, Keyboard } from 'react-native'
import IconButton from '../../components/IconButton';

interface PlayerInputProps {
    onAddPlayer: (name?: string) => void
}

function PlayerInput({ onAddPlayer }: PlayerInputProps) {
    const [newPlayer, setNewPlayer] = useState<string>();

    const addPlayer = () => {
        console.log('Adding player!');
        onAddPlayer(newPlayer);
        setNewPlayer(undefined);
        Keyboard.dismiss();
    }

    return (
        <>
            <View style={sharedStyles.row}>
                <TextInput style={sharedStyles.bodyText} placeholder='New Player' onChangeText={setNewPlayer} value={newPlayer}/>
            </View>
            <View style={styles.addButton}>
                <IconButton icon={'account'} title={'Add Player'} clickHandler={addPlayer} iconSide='left'/>
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

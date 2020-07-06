import React, { useState } from 'react'
import { sharedStyles } from '../../styles/shared'
import { View, TextInput, Button, StyleSheet, Keyboard } from 'react-native'

interface PlayerInputProps {
    onAddPlayer: (name?: string) => void
}

function PlayerInput({ onAddPlayer }: PlayerInputProps) {
    const [newPlayer, setNewPlayer] = useState<string>();

    const addPlayer = () => {
        onAddPlayer(newPlayer);
        setNewPlayer(undefined);
        Keyboard.dismiss();
    }

    return (
        <>
            <View style={sharedStyles.row}>
                <TextInput placeholder='New Player' onChangeText={setNewPlayer} value={newPlayer}/>
            </View>
            <View style={styles.addButton}>
                <Button title='Add Player' onPress={addPlayer} color='#FCA47C'/>
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

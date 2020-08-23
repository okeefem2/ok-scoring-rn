import React, { useState } from 'react'
import { sharedStyles } from '../../styles/shared'
import { View, TextInput, StyleSheet, Keyboard } from 'react-native'
import IconButton from '../../components/IconButton';
import { v4 as uuid } from 'react-native-uuid';
import ModalSelector from 'react-native-modal-selector';
import { colors } from '../../styles/colors';
import { useDiceIcon } from '../../hooks/useDiceIcon';

interface GameInputProps {
    onAddGame: (game: string) => void,
    selectableGames?: string[];
}

function GameInput({ onAddGame, selectableGames }: GameInputProps) {

    const addGame = (newGame) => {
        if (!newGame) {
            return;
        }
        onAddGame(newGame);
        setNewGame(undefined);
        Keyboard.dismiss();
    }

    return (
        <>
            <View style={sharedStyles.spacedRowBordered}>
                <TextInput style={sharedStyles.bodyText} placeholder="what're we playing?" onChangeText={setNewGame} value={newGame}/>
            </View>
            <View style={sharedStyles.spacedRowNoBorder}>
                {
                    selectableGames?.length ?
                    <ModalSelector
                        initValueTextStyle={{ color: colors.primary }}
                        selectTextStyle={{ color: colors.primary }}
                        optionTextStyle={{ color: colors.secondary }}
                        cancelTextStyle={{ color: colors.tertiary }}
                        selectedKey={newGame}
                        data={selectableGames}
                        initValue="Select A Game"
                        onChange={setNewGame}
                    />
                    : <></>
                }
            </View>
        </>
    );
}

export default GameInput;

const styles = StyleSheet.create({
    addButton: {
        margin: 0,
        padding: 15,
    },
});

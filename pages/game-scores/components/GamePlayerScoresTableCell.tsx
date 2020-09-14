import React, { useContext, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Menu, Provider } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { sharedStyles } from '../../../styles/shared';
import { gameContext } from '../../../state/game.store';
import { connectActionSheet, useActionSheet } from '@expo/react-native-action-sheet';
import { colors } from '../../../styles/colors';

type GamePlayerScoresTableCell = {
    playerKey: string;
    scoreIndex: number;
    score: number;
}
const GamePlayerScoresTableCell = ({ playerKey, score, scoreIndex }: GamePlayerScoresTableCell) => {
    const {editPlayerScore, deletePlayerScore} = useContext(gameContext);

    const { showActionSheetWithOptions } = useActionSheet();


    return (
        <TouchableOpacity onPress={() => showActionSheetWithOptions({
            options: [ 'Edit', 'Delete', 'Cancel'],
            tintColor: colors.primary,
            cancelButtonIndex: 2,
            destructiveButtonIndex: 1,
            destructiveColor: colors.tertiary
        }, (buttonIndex) => {
            if (buttonIndex === 0) {
                editPlayerScore({ playerKey, score, scoreIndex });
            } else if (buttonIndex === 1) {
                deletePlayerScore({ playerKey, score, scoreIndex });
            }
        })}>
            <Text style={[sharedStyles.scoreTabelCell]}>
                {score}
            </Text>
        </TouchableOpacity>
    );
}

export default connectActionSheet(GamePlayerScoresTableCell);

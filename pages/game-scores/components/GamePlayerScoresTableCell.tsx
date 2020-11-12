import React, { useContext, useEffect, useState } from 'react'
import { Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { sharedStyles } from '../../../styles/shared';
import { gameContext } from '../../../state/game.store';
import { connectActionSheet, useActionSheet } from '@expo/react-native-action-sheet';
import { colors } from '../../../styles/colors';

type GamePlayerScoresTableCellProps = {
    playerKey: string;
    scoreIndex: number;
    score: number;
}
const GamePlayerScoresTableCell = ({ playerKey, score, scoreIndex }: GamePlayerScoresTableCellProps) => {
    const {editPlayerScore, deletePlayerScore, editingPlayerScore} = useContext(gameContext);

    const [isBeingEdited, setIsBeingEdited] = useState(false);

    useEffect(() => {
        const cellIsBeingEdited = editingPlayerScore?.player?.key === playerKey && editingPlayerScore?.scoreIndex === scoreIndex;
        setIsBeingEdited(cellIsBeingEdited);
    }, [editingPlayerScore]);

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
                deletePlayerScore({ playerKey, scoreIndex });
            }
        })}>
            <Text style={[sharedStyles.scoreTabelCell, isBeingEdited ?  sharedStyles.editingCell : sharedStyles.touchableCell ]}>
                {score}
            </Text>
        </TouchableOpacity>
    );
}

export default connectActionSheet(GamePlayerScoresTableCell);

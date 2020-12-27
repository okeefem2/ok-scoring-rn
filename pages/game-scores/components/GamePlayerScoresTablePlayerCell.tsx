import { useActionSheet } from '@expo/react-native-action-sheet'
import React, { useContext } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { truncateText } from '../../../hooks/truncateString'
import { Player } from '../../../model/player'
import { gameContext } from '../../../state/game.store'
import { colors } from '../../../styles/colors'
import { sharedStyles } from '../../../styles/shared'

type GamePlayerScoresTablePlayerCellProps = {
    selectable: boolean;
    player: Player;
    active: boolean;
}

const GamePlayerScoresTablePlayerCell = ({ selectable, player, active }: GamePlayerScoresTablePlayerCellProps) => {
    const {setActivePlayer, deletePlayer} = useContext(gameContext);

    const displayName = truncateText(player.name, 7);

    const { showActionSheetWithOptions } = useActionSheet();

    const showActionSheetForPlayer = () => showActionSheetWithOptions({
        options: [ 'Delete', 'Cancel'],
        tintColor: colors.primary,
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0,
        destructiveColor: colors.tertiary
    }, (buttonIndex) => {
        if (buttonIndex === 0) {
            deletePlayer(player.key);
        }
    })

    return (
        <View style={[sharedStyles.plainRow, { minWidth: 50 }]} key={player.key}>
            {
                selectable ?
                <TouchableOpacity onPress={() => setActivePlayer(player)} onLongPress={showActionSheetForPlayer}>
                    <Text style={[sharedStyles.bodyText, active ? sharedStyles.editingCell : sharedStyles.touchableCell, sharedStyles.p5, { minWidth: 50 }]}>
                        {displayName}
                    </Text>
                </TouchableOpacity> :
                <Text style={[sharedStyles.bodyText, sharedStyles.p5, { minWidth: 50 }]}>
                    {displayName}
                </Text>
            }
        </View>
    )
}

export default GamePlayerScoresTablePlayerCell;

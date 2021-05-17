import { useActionSheet } from '@expo/react-native-action-sheet'
import React, { useContext } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { truncateText } from '../../../hooks/truncateString'
import { Player } from '../../../model/player'
import { gameContext } from '../../../state/game.store'
import { colors } from '../../../styles/colors'
import { sharedStyles } from '../../../styles/shared'
import { MaterialCommunityIcons } from '@expo/vector-icons';

type GamePlayerScoresTablePlayerCellProps = {
    selectable: boolean;
    player: Player;
    active: boolean;
    winning: boolean;
    isDealer: boolean;
}

const GamePlayerScoresTablePlayerCell = ({
    selectable,
    player,
    active,
    winning,
    isDealer,
}: GamePlayerScoresTablePlayerCellProps) => {
    const { setActivePlayer, deletePlayer } = useContext(gameContext);
    const displayName = truncateText(player.name, 14);
    const { showActionSheetWithOptions } = useActionSheet();

    const showActionSheetForPlayer = () => showActionSheetWithOptions({
        options: ['Delete', 'Cancel'],
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
        <View key={player.key}>
            {
                selectable ?
                    <TouchableOpacity onPress={() => setActivePlayer(player)} onLongPress={showActionSheetForPlayer}
                        style={[active ? sharedStyles.editingCell : sharedStyles.touchableCell, sharedStyles.scoreTabelTopCellPlayer, { display: 'flex', flexDirection: 'row', alignItems: 'center' }]}>
                        <Text style={[{
                            fontFamily: 'Quicksand',
                            fontSize: 18
                        }]}>
                            {displayName}
                        </Text>
                        {winning && <MaterialCommunityIcons
                            name={'crown'} size={18}
                            style={sharedStyles.ml5}
                            color={winning ? colors.tertiary : colors.white} />}
                        {isDealer && <MaterialCommunityIcons
                            name={'cards'} size={18}
                            style={sharedStyles.ml5}
                            color={isDealer ? colors.tertiary : colors.white} />}
                    </TouchableOpacity> :
                    <Text style={[sharedStyles.scoreTabelTopCell]}>
                        {displayName}
                    </Text>
            }
        </View>
    )
}

export default GamePlayerScoresTablePlayerCell;

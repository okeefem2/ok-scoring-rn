import React, { useContext } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { truncateText } from '../../../hooks/truncateString'
import { Player } from '../../../model/player'
import { gameContext } from '../../../state/game.store'
import { sharedStyles } from '../../../styles/shared'

type GamePlayerScoresTablePlayerCellProps = {
    selectable: boolean;
    player: Player;
    active: boolean;
}

const GamePlayerScoresTablePlayerCell = ({ selectable, player, active }: GamePlayerScoresTablePlayerCellProps) => {
    const {setActivePlayer} = useContext(gameContext);

    const displayName = truncateText(player.name, 7);

    return (
        <View style={[sharedStyles.plainRow, { minWidth: 50 }]} key={player.key}>
            {
                selectable ?
                <TouchableOpacity onPress={() => setActivePlayer(player)}>
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

const styles = StyleSheet.create({});

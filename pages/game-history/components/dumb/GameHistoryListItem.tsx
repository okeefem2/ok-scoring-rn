import React from 'react'
import { Text, View } from 'react-native'
import { sharedStyles } from '../../../../styles/shared'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { commaSeperateWithEllipsis } from '../../../../util/array.util';
import { colors } from '../../../../styles/colors';
import IconButton from '../../../../components/IconButton';
import { Player } from '../../../../model/player';
import { Settings } from '../../../../model/settings';
import { useDiceIcon } from '../../../../hooks/useDiceIcon';
import { GameState } from '../../../../model/game-state';

interface GameHistoryListItemProps {
    game: GameState;
    copyGameSetup: (players: Player[], settings: Settings, description: string) => void;
    continueGame: (game: GameState) => void;
};

const GameHistoryListItem = ({ game, copyGameSetup, continueGame }: GameHistoryListItemProps) => {
    // TODO set state score history and navigate
    const diceIcon = useDiceIcon();
    // get the winning player to the front of the list
    game.players.sort((a) => game.winningPlayerKey === a.key ? -1 : 1);
    const playerNames = commaSeperateWithEllipsis(game.players.map(p => p.name));
    return (
        <View style={sharedStyles.spacedRowBordered}>
            <View style={sharedStyles.column}>
                <View style={sharedStyles.plainRow}>
                    <Text style={[sharedStyles.ml5, sharedStyles.subHeaderText]}>
                        {game.description}
                    </Text>
                </View>
                <View style={sharedStyles.plainRow}>
                    <MaterialCommunityIcons name='calendar-outline' size={28} color={colors.tertiary} />
                    <Text style={[sharedStyles.ml5, sharedStyles.subHeaderText]}>
                        {game.date}
                    </Text>
                </View>
                <View style={[sharedStyles.plainRow]}>
                    <MaterialCommunityIcons name='crown' size={18} color={colors.tertiary} />
                    <Text style={[sharedStyles.ml5, sharedStyles.bodyText]}>
                        {playerNames}
                    </Text>
                </View>
                <View style={[sharedStyles.ml20, sharedStyles.plainRow]}>
                    <IconButton icon='replay' title='Copy Game Setup' clickHandler={() => copyGameSetup(game.players, game.settings as Settings, game.description)} color={colors.primary} />
                </View>
                <View style={[sharedStyles.ml20, sharedStyles.plainRow]}>
                    <IconButton icon={diceIcon} title='Continue Game' clickHandler={() => continueGame(game)} color={colors.primary}  />
                </View>
                {/* <View style={[sharedStyles.ml20, sharedStyles.plainRow]}>
                    <IconButton icon='book' title='View Scores' clickHandler={() => showScoreHistory(game)} />
                </View> */}
            </View>
        </View>
    )
}

export default GameHistoryListItem;

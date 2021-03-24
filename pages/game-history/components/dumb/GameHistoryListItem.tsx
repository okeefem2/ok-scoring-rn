import React, { useEffect, useRef } from 'react'
import { Animated, Text, View } from 'react-native'
import { sharedStyles } from '../../../../styles/shared'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../../styles/colors';
import IconButton from '../../../../components/IconButton';
import { Player } from '../../../../model/player';
import { Settings } from '../../../../model/settings';
import { useDiceIcon } from '../../../../hooks/useDiceIcon';
import { GameState } from '../../../../model/game-state';
import { formatDate } from '../../../../hooks/formatDate';
import { Sort } from '../../../../state/sort';

interface GameHistoryListItemProps {
    index: number;
    game: GameState;
    sort: Sort<GameState>;
    copyGameSetup: (players: Player[], settings: Settings, description: string) => void;
    continueGame: (game: GameState) => void;
    showGameState: (gameState: GameState) => void;
    deleteGame: (gameKey: string) => void
};

const GameHistoryListItem = ({ sort, index, game, copyGameSetup, continueGame, showGameState, deleteGame }: GameHistoryListItemProps) => {
    // TODO set state score history and navigate
    const diceIcon = useDiceIcon();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const formattedDate = formatDate(game.date);
    // get the winning player to the front of the list
    useEffect(() => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 350 * (index + 1),
            useNativeDriver: true
        }).start();
    }, [game, sort]);

    return (
        <Animated.View
            style={[
                sharedStyles.spacedRowBordered,
                { opacity: fadeAnim },
            ]}
        >
            <View style={sharedStyles.column}>
                <View style={sharedStyles.plainRow}>
                    <Text style={[sharedStyles.ml5, sharedStyles.subHeaderText]}>
                        {game.description}
                    </Text>
                </View>
                <View style={sharedStyles.plainRow}>
                    <MaterialCommunityIcons name='calendar-outline' size={28} color={colors.tertiary} />
                    <Text style={[sharedStyles.ml5, sharedStyles.subHeaderText]}>
                        {formattedDate}
                    </Text>
                </View>
                <View style={[sharedStyles.plainRow]}>
                    <MaterialCommunityIcons name='crown' size={18} color={colors.tertiary} />
                    <Text style={[sharedStyles.ml5, sharedStyles.bodyText]}>
                        {game.playerNamesForDisplay}
                    </Text>
                </View>
                <View style={[sharedStyles.ml20, sharedStyles.plainRow]}>
                    <IconButton icon='replay' title='Copy Game Setup' clickHandler={() => copyGameSetup(game.players, game.settings as Settings, game.description)} color={colors.primary} />
                </View>
                <View style={[sharedStyles.ml20, sharedStyles.plainRow]}>
                    <IconButton icon={diceIcon} title='Continue Game' clickHandler={() => continueGame(game)} color={colors.primary} />
                </View>
                <View style={[sharedStyles.ml20, sharedStyles.plainRow]}>
                    <IconButton icon='book' title='View Scores' clickHandler={() => showGameState(game)} />
                </View>
                <View style={[sharedStyles.ml20, sharedStyles.plainRow]}>
                    <IconButton icon='delete' title='Delete Game' clickHandler={() => deleteGame(game.key)} color={colors.tertiary} />
                </View>
            </View>
        </Animated.View>
    )
}

export default GameHistoryListItem;

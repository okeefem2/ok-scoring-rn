import React, { useContext, useState } from 'react'
import { FlatList, View, Text, StyleSheet, TextInput } from 'react-native'
import NavBar from '../../components/NavBar'
import { sharedStyles } from '../../styles/shared'
import GameScoreListItem from './components/GameScoresListItem'
import { gameContext } from '../../state/game.store'
import { observer } from 'mobx-react'
import { PageNavigationProps } from '../../navigation'
import { RouteName as NewGameRoute } from '../new-game/NewGame';
import { gameHistoryContext } from '../../state/game-history.store'
import { playerHistoryContext } from '../../state/players-history.store'
import GamePlayerScsoresTableRow from './components/GamePlayerScoresTableRow'
import Header from '../../components/Header'
import GamePlayerScoresTableRow from './components/GamePlayerScoresTableRow'
import { ScrollView } from 'react-native-gesture-handler'

export type GameScoreProps = {
    gameOver?: boolean;
}

const GameScores = ({ route: { params: { gameOver } }, navigation }: PageNavigationProps<typeof RouteName>) => {
    const {
        players,
        gameState,
        initGameState,
        scoreHistory,
        winningPlayerKey,
        scoreHistoryRounds,
        editingPlayerScore,
        updateRoundScore
    } = useContext(gameContext);
    const { saveGame } = useContext(gameHistoryContext);
    const { savePlayers } = useContext(playerHistoryContext);

    const [tempNewScore, setTempNewScore] = useState<number>();

    const exitToNewGame = () => {
        initGameState(undefined);
        navigation.reset({
            index: 0,
            routes: [{ name: NewGameRoute }],
        });
    };

    // TODO make a read only view version of this for game history
    // Rename this to game scores or something similar

    return (
        <View style={sharedStyles.pageContainer}>
            <NavBar
                leftButton={!gameOver ?
                    { icon: 'chevron-left', title: 'Back', clickHandler: navigation.pop } :
                    { icon: 'delete-outline', title: 'Discard & Quit', clickHandler: exitToNewGame }
                }
                rightButton={gameOver ? { icon: 'content-save-outline', title: 'Save & Quit', clickHandler: () => {
                    savePlayers(gameState.players);
                    saveGame(gameState);
                    exitToNewGame();
                } } : undefined}
            />
            <View style={[sharedStyles.column]}>
                <Header title={gameState.description}/>
                <Text style={[sharedStyles.bodyText, sharedStyles.mb25, sharedStyles.centeredText]}>
                    {gameState.date}
                </Text>
                <FlatList
                    style={[sharedStyles.scroll, sharedStyles.mb25]}
                    data={players}
                    renderItem={
                        (itemData) =>
                            <GameScoreListItem
                                key={itemData.item.key}
                                player={itemData.item}
                                playerScoreHistory={scoreHistory[itemData.item.key]}
                                winning={itemData.item.key === winningPlayerKey}
                            />
                    }
                />

                {
                    editingPlayerScore ? <View style={sharedStyles.spacedRowNoBorder}>
                            <Text style={[sharedStyles.bodyText]}>
                                Update Score:
                            </Text>
                            <TextInput
                                style={[]}
                                placeholder='Update Score'
                                onChangeText={(n) => !!n && setTempNewScore(parseInt(n.replace(/[^0-9]/g, ''), 10))}
                                value={tempNewScore?.toString()}
                                autoCorrect={false}
                                returnKeyType="done"
                                clearTextOnFocus={true}
                                onEndEditing={() => updateRoundScore(editingPlayerScore.playerKey, editingPlayerScore.scoreIndex, tempNewScore || 0)}
                                keyboardType='number-pad'/>
                    </View> : null
                }


                <View style={[sharedStyles.plainRow]}>
                        <View style={[styles.players]}></View>
                        <View style={styles.scores}>
                            <View style={sharedStyles.plainRowBordered}>
                                    {
                                        scoreHistoryRounds.map(
                                            r =>
                                            <Text style={[sharedStyles.scoreTabelCell]} key={r}>
                                                {r}
                                            </Text>
                                        )
                                    }
                            </View>
                        </View>
                    </View>
                <ScrollView>
                    <View style={[sharedStyles.plainRow]}>
                        <View style={[styles.players]}>
                            {
                                players.map(player => (
                                    <View style={[sharedStyles.plainRow, sharedStyles.mb5, sharedStyles.mt5]}>
                                        <Text style={[sharedStyles.bodyText]}>
                                            {player.name}
                                        </Text>
                                    </View>
                                ))
                            }
                        </View>
                        <View style={styles.scores}>
                            <ScrollView horizontal={true}>
                                <View style={sharedStyles.column}>
                                    {
                                        players.map(
                                            player => <GamePlayerScoresTableRow playerScoreHistory={scoreHistory[player.key]} key={player.key}/>
                                        )
                                    }
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    table: {
        display: 'flex',
        flexDirection: 'row',
    },
    players: {
        flex: 1
    },
    scores: {
        flex: 4
    }
});


export const RouteName = 'GameScore';
export default observer(GameScores);

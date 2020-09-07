import React, { useContext } from 'react'
import { FlatList, View } from 'react-native'
import NavBar from '../../components/NavBar'
import { sharedStyles } from '../../styles/shared'
import GameScoreListItem from './components/GameScoresListItem'
import { gameContext } from '../../state/game.store'
import { observer } from 'mobx-react'
import { PageNavigationProps } from '../../navigation'
import { RouteName as NewGameRoute } from '../new-game/NewGame';
import { gameHistoryContext } from '../../state/game-history.store'

export type GameScoreProps = {
    gameOver?: boolean;
}

const GameScores = ({ gameOver, navigation }: GameScoreProps & PageNavigationProps<typeof RouteName>) => {

    const {
        players,
        gameState,
        initGameState,
        scoreHistory,
        updateRoundScore,
        removeRound,
        winningPlayerKey
    } = useContext(gameContext);
    const { saveGame } = useContext(gameHistoryContext);

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
                    { icon: 'chevron-left', title: 'Back', clickHandler: navigation.goBack } :
                    { icon: 'delete-outline', title: 'Discard & Quit', clickHandler: exitToNewGame }
                }
                rightButton={gameOver ? { icon: 'content-save-outline', title: 'Save & Quit', clickHandler: () => {
                    saveGame(gameState);
                    exitToNewGame();
                } } : undefined}
            />
            <FlatList
                style={sharedStyles.scroll}
                data={players}
                renderItem={
                    (itemData) =>
                        <GameScoreListItem
                            key={itemData.item.key}
                            player={itemData.item}
                            playerScoreHistory={scoreHistory[itemData.item.key]}
                            updateRoundScore={updateRoundScore}
                            removeRound={removeRound}
                            winning={itemData.item.key === winningPlayerKey}
                        />
                }
            />
        </View>
    )
}

export const RouteName = 'GameScore';
export default observer(GameScores)

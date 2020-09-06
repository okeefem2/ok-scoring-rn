import React, { useContext } from 'react'
import { FlatList } from 'react-native'
import NavBar from '../../components/NavBar'
import { sharedStyles } from '../../styles/shared'
import ScoreHistoryListItem from './components/ScoreHistoryListItem'
import { gameContext } from '../../state/game.store'
import { scoreHistoryContext } from '../../state/score-history.store'
import { observer } from 'mobx-react'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../../navigation'
import { RouteName as NewGameRoute } from '../new-game/NewGame';
import { gameHistoryContext } from '../../state/game-history.store'

export type ScoreHistoryProps = {
    gameOver?: boolean;
}

type ScoreHistoryNavigationProps = {
    navigation: StackNavigationProp<RootStackParamList, typeof RouteName>
};

const ScoreHistory = ({ gameOver, navigation }: ScoreHistoryProps & ScoreHistoryNavigationProps) => {

    const {gamePlayers, gameState, initNewGame } = useContext(gameContext);
    const {
        scoreHistory,
        updateRoundScore,
        removeRound,
        winningPlayerKey
    } = useContext(scoreHistoryContext);
    const { saveGame } = useContext(gameHistoryContext);

    const exitToNewGame = () => {
        initNewGame();
        navigation.reset({
            index: 0,
            routes: [{ name: NewGameRoute }],
        });
    };

    return (
        <>
            <NavBar
                leftButton={!gameOver ?
                    { icon: 'chevron-left', title: 'Back', clickHandler: navigation.goBack } :
                    { icon: 'delete-outline', title: 'Discard & Quit', clickHandler: exitToNewGame }
                }
                rightButton={gameOver ? { icon: 'content-save-outline', title: 'Save & Quit', clickHandler: () => {
                    saveGame({
                        ...gameState,
                        scoreHistory
                    });
                    exitToNewGame();
                } } : undefined}
            />
            <FlatList
                style={sharedStyles.scroll}
                data={gamePlayers}
                renderItem={
                    (itemData) =>
                        <ScoreHistoryListItem
                            key={itemData.item.key}
                            player={itemData.item}
                            playerScoreHistory={scoreHistory[itemData.item.key]}
                            updateRoundScore={updateRoundScore}
                            removeRound={removeRound}
                            winning={itemData.item.key === winningPlayerKey}
                        />
                }
            />
        </>
    )
}

export const RouteName = 'ScoreHistory';
export default observer(ScoreHistory)

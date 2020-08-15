import React from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import { Player } from '../../model/player'
import NavBar from '../../components/NavBar'
import { GameScoreHistory } from '../../model/game-score-history'
import { useDiceIcon } from '../../hooks/useDiceIcon'
import { sharedStyles } from '../../styles/shared'
import ScoreHistoryListItem from './ScoreHistoryListItem'

interface ScoreHistoryProps {
    players: Player[];
    scoreHistory: GameScoreHistory;
    exitScoreHistory: () => void;
    updateRoundScore?: (playerKey: string, roundIndex: number, newScore: number) => void;
    removeRound?: (playerKey: string, roundIndex: number) => void;
    winningPlayerKey: string;
    losingPlayerKey: string;
    gameOver?: boolean;
}
const ScoreHistory = ({ players, exitScoreHistory, scoreHistory, updateRoundScore, removeRound, winningPlayerKey, losingPlayerKey, gameOver = false }: ScoreHistoryProps) => {
    const diceIcon = useDiceIcon();

    return (
        <>
            <NavBar
                leftButton={!gameOver ? { icon: diceIcon, title: 'Back To Game', clickHandler: exitScoreHistory } : undefined}
                rightButton={gameOver ? { icon: diceIcon, title: 'Start New Game', clickHandler: exitScoreHistory } : undefined}
            />
            <FlatList
                style={sharedStyles.scroll}
                data={players}
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

export default ScoreHistory

const styles = StyleSheet.create({})

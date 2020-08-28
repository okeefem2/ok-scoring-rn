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
    exitScoreHistory: (response?: boolean) => void;
    updateRoundScore?: (playerKey: string, roundIndex: number, newScore: number) => void;
    removeRound?: (playerKey: string, roundIndex: number) => void;
    winningPlayerKey: string;
    losingPlayerKey?: string;
    gameOver?: boolean;
}
const ScoreHistory = ({ players, exitScoreHistory, scoreHistory, updateRoundScore, removeRound, winningPlayerKey, losingPlayerKey, gameOver = false }: ScoreHistoryProps) => {

    return (
        <>
            <NavBar
                leftButton={!gameOver ?
                    { icon: 'chevron-left', title: 'Back', clickHandler: exitScoreHistory } :
                    { icon: 'delete-outline', title: 'Discard & Quit', clickHandler: () => exitScoreHistory(false) }}
                rightButton={gameOver ? { icon: 'content-save-outline', title: 'Save & Quit', clickHandler: () => exitScoreHistory(true) } : undefined}
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

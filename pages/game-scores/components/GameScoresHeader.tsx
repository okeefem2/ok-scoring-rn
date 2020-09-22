import React from 'react'
import { Text, FlatList } from 'react-native'
import { GameState } from '../../../model/game-state'
import Header from '../../../components/Header'
import { sharedStyles } from '../../../styles/shared'
import GameScoreListItem from './GameScoresListItem'

type GameScoresHeaderProps = {
    gameState: GameState;
}
const GameScoresHeader = ({ gameState }: GameScoresHeaderProps) => {
    return (
        <>
            <Header title={gameState.description} />
            <Text style={[sharedStyles.bodyText, sharedStyles.mb25, sharedStyles.centeredText]}>
                {gameState.date}
            </Text>
            <FlatList
                style={[sharedStyles.scroll, sharedStyles.mb25]}
                data={gameState.players}
                renderItem={
                    (itemData) =>
                        <GameScoreListItem
                            key={itemData.item.key}
                            player={itemData.item}
                            playerScoreHistory={gameState.scoreHistory[itemData.item.key]}
                            winning={itemData.item.key === gameState.winningPlayerKey}
                        />
                }
            />
        </>
    )
}

export default GameScoresHeader;

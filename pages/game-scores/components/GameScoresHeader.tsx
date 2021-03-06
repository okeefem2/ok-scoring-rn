import React from 'react'
import { Text, FlatList } from 'react-native'
import { GameState } from '../../../model/game-state'
import Header from '../../../components/Header'
import { sharedStyles } from '../../../styles/shared'
import GameScoreListItem from './GameScoresListItem'
import { formatDate } from '../../../hooks/formatDate'
import { Player } from '../../../model/player'

type GameScoresHeaderProps = {
    gameState: GameState;
    playerUpdated: (p: Player) => void;
}
const GameScoresHeader = ({ gameState, playerUpdated }: GameScoresHeaderProps) => {
    const formattedDate = formatDate(gameState.date);
    return (
        <>
            <Header title={gameState.description} />
            <Text style={[sharedStyles.bodyText, sharedStyles.mb25, sharedStyles.centeredText]}>
                {formattedDate}
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
                            playerUpdated={playerUpdated}
                        />
                }
            />
        </>
    )
}

export default GameScoresHeader;

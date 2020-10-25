import React from 'react'
import { Text, View } from 'react-native'
import { PlayerScoreHistory } from '../../../model/player-score-history'
import { sharedStyles } from '../../../styles/shared'
import GamePlayerScoresTableCell from './GamePlayerScoresTableCell'

type GamePlayerScoresTableProps = {
    playerScoreHistory: PlayerScoreHistory;
    editable: boolean;
}
const GamePlayerScoresTableRow = ({ playerScoreHistory, editable }: GamePlayerScoresTableProps) => {
    return playerScoreHistory ? (
        <View style={[sharedStyles.plainRow]} key={playerScoreHistory.key}>
            {
                playerScoreHistory.scores.map((s, i) => (
                    editable ?
                        <GamePlayerScoresTableCell
                            score={s}
                            scoreIndex={i}
                            playerKey={playerScoreHistory.playerKey}
                            key={`${playerScoreHistory.key}-${s}-${i}`}
                        /> :
                        <Text style={[sharedStyles.scoreTabelCell]} key={`${playerScoreHistory.key}-${s}-${i}`}>{s}</Text>
                ))
            }
        </View>
    ) : null;
}

export default GamePlayerScoresTableRow;

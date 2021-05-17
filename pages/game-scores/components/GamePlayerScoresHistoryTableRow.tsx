import React from 'react'
import { View } from 'react-native'
import { PlayerScoreHistory } from '../../../model/player-score-history'
import { sharedStyles } from '../../../styles/shared'
import GamePlayerScoresTableScoreCell from './GamePlayerScoresTableScoreCell'

type GamePlayerScoresTableProps = {
    playerScoreHistory: PlayerScoreHistory;
    editable: boolean;
}
const GamePlayerScoresHistoryTableRow = ({ playerScoreHistory, editable }: GamePlayerScoresTableProps) => {
    return playerScoreHistory ? (
        <View style={[sharedStyles.plainRow]} key={playerScoreHistory.key}>
            {
                playerScoreHistory.scores.length ?
                    playerScoreHistory.scores.map((s, i) => (
                        <GamePlayerScoresTableScoreCell
                            score={s}
                            scoreIndex={i}
                            playerKey={playerScoreHistory.playerKey}
                            key={`${playerScoreHistory.key}-${s}-${i}`}
                            editable={editable}
                        />
                    )) : <View style={[sharedStyles.scoreTabelTopCell]}></View>
            }
        </View>
    ) : null;
}

export default GamePlayerScoresHistoryTableRow;

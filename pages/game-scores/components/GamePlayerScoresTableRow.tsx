import React from 'react'
import { Text, View } from 'react-native'
import { PlayerScoreHistory } from '../../../model/player-score-history'
import { sharedStyles } from '../../../styles/shared'
import GamePlayerScoresTableCell from './GamePlayerScoresTableCell'

type GamePlayerScoresTableProps = {
    playerScoreHistory: PlayerScoreHistory;
}
const GamePlayerScoresTableRow = ({ playerScoreHistory }: GamePlayerScoresTableProps) => {
    return (
        <View style={[sharedStyles.plainRow]} key={playerScoreHistory.key}>
            {
                playerScoreHistory.scores.map((s, i) => (
                    <GamePlayerScoresTableCell score={s} scoreIndex={i} playerKey={playerScoreHistory.playerKey} key={`${playerScoreHistory.key}-${s}-${i}`}/>
                ))
            }
        </View>
    );
}

export default GamePlayerScoresTableRow;

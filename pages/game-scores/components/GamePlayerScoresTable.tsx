import React, { useContext } from "react";
import { ScrollView } from "react-native";
import { sharedStyles } from "../../../styles/shared";
import { Player } from "../../../model/player";
import { GameScoreHistory } from "../../../model/game-score-history";
import { gameContext } from "../../../state/game.store";
import GamePlayerScoresTableRow from "./GamePlayerScoresTableRow";

type GamePlayerScoresTableProps = {
    players: Player[];
    scoreHistoryRounds: number[];
    scoreHistory: GameScoreHistory;
    editable?: boolean;
    playersSelectable?: boolean;
};
export const GamePlayerScoresTable = ({
    players,
    scoreHistoryRounds,
    scoreHistory,
    editable = true,
    playersSelectable = false,
}: GamePlayerScoresTableProps) => {
    const { activeGamePlayerScore, winningPlayerKey, dealingPlayerKey } = useContext(gameContext);

    return (
        <>
            <ScrollView style={[sharedStyles.mt25]}>
                {players.map((player) => (
                    <GamePlayerScoresTableRow
                        key={player.key}
                        active={activeGamePlayerScore?.player.key === player.key}
                        winning={winningPlayerKey === player.key}
                        player={player}
                        scoreHistory={scoreHistory}
                        editable={editable}
                        selectable={playersSelectable}
                        scoreHistoryRounds={scoreHistoryRounds}
                        isDealer={dealingPlayerKey === player.key}
                    />
                ))}
            </ScrollView>
        </>
    );
};

export default GamePlayerScoresTable;

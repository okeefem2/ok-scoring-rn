import React, { useContext } from "react";
import { Text, View, ScrollView } from "react-native";
import { sharedStyles } from "../../../styles/shared";
import GamePlayerScoresHistoryTableRow from "./GamePlayerScoresHistoryTableRow";
import { Player } from "../../../model/player";
import { GameScoreHistory } from "../../../model/game-score-history";
import { gameContext } from "../../../state/game.store";
import GamePlayerScoresTablePlayerCell from "./GamePlayerScoresTablePlayerCell";
import IconButton from "../../../components/IconButton";
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
    const { activeGamePlayerScore } = useContext(gameContext);
    // TODO break these into components for easier tracking of open state, also animations

    return (
        <>
            <ScrollView style={[sharedStyles.mt25]}>
                {players.map((player) => (
                    <GamePlayerScoresTableRow
                        key={player.key}
                        active={activeGamePlayerScore?.player.key === player.key}
                        player={player}
                        scoreHistory={scoreHistory}
                        editable={editable}
                        selectable={playersSelectable}
                        scoreHistoryRounds={scoreHistoryRounds}
                    />
                ))}
            </ScrollView>
        </>
    );
};

export default GamePlayerScoresTable;

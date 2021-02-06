import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import IconButton from "../../../components/IconButton";
import { GameScoreHistory } from "../../../model/game-score-history";
import { Player } from "../../../model/player";
import { PlayerScoreHistory } from "../../../model/player-score-history";
import { sharedStyles } from "../../../styles/shared";
import GamePlayerScoresHistoryTableRow from "./GamePlayerScoresHistoryTableRow";
import GamePlayerScoresTablePlayerCell from "./GamePlayerScoresTablePlayerCell";

type GamePlayerScoresTableRowProps = {
    player: Player;
    active: boolean;
    editable: boolean;
    selectable: boolean;
    scoreHistory: GameScoreHistory;
    scoreHistoryRounds: number[];
};

const GamePlayerScoresTableRow = ({
    player,
    active,
    editable,
    selectable,
    scoreHistory,
    scoreHistoryRounds,
}: GamePlayerScoresTableRowProps) => {
    const [roundsShown, setRoundsShown] = useState(false);
    return (
        <>
            <View style={[sharedStyles.plainRow]} key={player.key}>
                <GamePlayerScoresTablePlayerCell
                    selectable={selectable}
                    player={player}
                    active={active}
                />
                <Text style={[sharedStyles.scoreTabelTopCell]}>
                    {scoreHistory[player.key]?.currentScore ?? 0} points
                </Text>
                <View style={sharedStyles.scoreTabelTopCell}>
                    <IconButton
                        icon={roundsShown ? 'chevron-down' : 'chevron-up'}
                        iconSide="right"
                        title="Rounds"
                        clickHandler={() => { setRoundsShown(!roundsShown); }}
                    ></IconButton>
                </View>
            </View>
            {
                roundsShown ?
                    <ScrollView
                        horizontal={true}
                        style={[sharedStyles.mb10, sharedStyles.ml10]}
                    >
                        <View style={[sharedStyles.column]}>
                            <View style={[sharedStyles.plainRowBordered]}>
                                {scoreHistoryRounds.map((r) => (
                                    <Text
                                        style={[
                                            sharedStyles.scoreTabelTopCell,
                                            sharedStyles.centeredText,
                                        ]}
                                        key={r}
                                    >
                                        {r}
                                    </Text>
                                ))}
                            </View>
                            <GamePlayerScoresHistoryTableRow
                                editable={editable}
                                playerScoreHistory={scoreHistory[player.key]}
                                key={player.key}
                            />
                        </View>
                    </ScrollView> : null
            }
        </>
    );
};

export default GamePlayerScoresTableRow;

const styles = StyleSheet.create({});

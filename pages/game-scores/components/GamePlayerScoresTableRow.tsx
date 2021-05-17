import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import IconButton from "../../../components/IconButton";
import { abbreviateNumber } from '../../../hooks/abbreviateNumber';
import { GameScoreHistory } from "../../../model/game-score-history";
import { Player } from "../../../model/player";
import { sharedStyles } from "../../../styles/shared";
import GamePlayerScoresHistoryTableRow from "./GamePlayerScoresHistoryTableRow";
import GamePlayerScoresTablePlayerCell from "./GamePlayerScoresTablePlayerCell";

type GamePlayerScoresTableRowProps = {
    player: Player;
    active: boolean;
    winning: boolean;
    editable: boolean;
    selectable: boolean;
    scoreHistory: GameScoreHistory;
    scoreHistoryRounds: number[];
    isDealer: boolean;
};

const GamePlayerScoresTableRow = ({
    player,
    active,
    winning,
    editable,
    selectable,
    scoreHistory,
    scoreHistoryRounds,
    isDealer,
}: GamePlayerScoresTableRowProps) => {
    const [roundsShown, setRoundsShown] = useState(false);
    const currentScore = abbreviateNumber(scoreHistory[player.key]?.currentScore);
    return (
        <>
            <View style={[sharedStyles.spacedRowNoBorder]} key={player.key}>
                <GamePlayerScoresTablePlayerCell
                    selectable={selectable}
                    player={player}
                    active={active}
                    winning={winning}
                    isDealer={isDealer}
                />
                <View style={[sharedStyles.scoreTabelTopCell, { display: 'flex', flexDirection: 'row', alignItems: 'center' }]}>
                    <IconButton
                        icon={roundsShown ? 'chevron-up' : 'chevron-down'}
                        iconSide="right"
                        title={` ${currentScore} pts`}
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

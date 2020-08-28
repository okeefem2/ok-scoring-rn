import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Player } from '../../model/player';
import { GameScoreHistory, GameState } from '../../model/game-score-history';
import NavBar from '../../components/NavBar';
import { sharedStyles } from '../../styles/shared';
import GameHistoryListItem from './GameHistoryListItem';
import { Settings } from '../../model/settings';
import ScoreHistory from '../game/ScoreHistory';
// TODO consolidate players settings and score history into a GameState
interface GameHistoryProps {
    games: GameState[];
    copyGameSetup: (players: Player[], settings: Settings, description: string) => void;
    continueGame: (game: GameState) => void;
    back: () => void;
}
const GameHistory = ({ games, copyGameSetup, continueGame, back }: GameHistoryProps) => {
    const [scoreHistory, setShowScoreHistory] = useState<GameState>();

    if (!!scoreHistory) {
        return (
            <ScoreHistory
                players={scoreHistory.players}
                scoreHistory={scoreHistory.scoreHistory}
                exitScoreHistory={() => setShowScoreHistory(undefined)}
                winningPlayerKey={scoreHistory.winningPlayerKey as string}
            />
        );
    }
    return (
        <>
            <NavBar
                leftButton={{ icon: 'chevron-left', title: 'Back', clickHandler: back }}
            />
            <FlatList
                style={sharedStyles.scroll}
                data={games}
                ListEmptyComponent={
                    <Text style={[sharedStyles.bodyText, sharedStyles.centeredText, sharedStyles.mt25]}>No Games Played Yet!</Text>
                }
                renderItem={
                    (itemData) => <GameHistoryListItem
                                        game={itemData.item}
                                        copyGameSetup={copyGameSetup}
                                        continueGame={continueGame}
                                        key={itemData.item.key}
                                        showScoreHistory={setShowScoreHistory}
                                        />
                }
            />
        </>
    );
}

export default GameHistory

const styles = StyleSheet.create({})

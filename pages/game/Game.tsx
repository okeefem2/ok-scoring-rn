import React, { useState } from 'react'
import { StyleSheet, Text, View, Button, TextInput } from 'react-native'
import { Player } from '../../model/player';
import { Settings } from '../../model/settings';
import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import GameTimer from './GameTimer';
import { sharedStyles } from '../../styles/shared';
import IconButton from '../../components/IconButton';

interface GameProps {
    players: Player[];
    settings: Settings;
    endGame: () => void;
}
const Game = ({players, settings, endGame}: GameProps) => {
    const [activePlayerScore, setActivePlayerScore] = useState<{player: Player, index: number }>({ player: players[0], index: 0, });
    const [playerScores, updatePlayers] = useState<Player[]>(players);
    const [scoreStep, updateScoreStep] = useState<number | undefined>(settings?.defaultScoreStep || 1);

    const updateActivePlayerScore = (value: number) => {
        const {player} = activePlayerScore;
        const score = (player.score ?? 0) + value
        setActivePlayerScore({ ...activePlayerScore, player: { ...player, score }});
    }
    const endPlayerTurn = ()  => {
        const { player, index } = activePlayerScore;
        const players = [ ...playerScores ];
        players[index] = player;
        updatePlayers(players);
        changePlayer(1);
    }

    const changePlayer = (n: 1 | -1) => {
        const { index } = activePlayerScore;
        let newIndex = index + n;
        if (newIndex >= playerScores.length) {
            newIndex = 0;
        } else if (newIndex < 0) {
            newIndex = playerScores.length - 1;
        }
        const newPlayer = playerScores[newIndex];
        setActivePlayerScore({ player: newPlayer, index: newIndex})
    }

    return (
        <View style={styles.gameContainer}>
            <View>
                <View>
                    <NavBar
                        leftButton={{ title: 'Scores', clickHandler: () => console.log('history')}}
                        rightButton={{ title: 'Finish Game', clickHandler: endGame}}
                    />
                </View>
                <View style={sharedStyles.rowNoBorder}>
                    <IconButton icon='chevron-left' clickHandler={() => changePlayer(-1)} />
                    <GameTimer />
                    <IconButton icon='chevron-right' clickHandler={() => changePlayer(1)} />
                </View>
                <View style={sharedStyles.rowNoBorder}>
                    <Header title={activePlayerScore.player.name}/>
                </View>

                <View style={sharedStyles.rowNoBorder}>
                    <Header title={activePlayerScore.player.score?.toString() || '0'}/>
                </View>
                <View style={sharedStyles.rowNoBorder}>
                    <IconButton icon='minus' clickHandler={() => scoreStep && updateActivePlayerScore(-1 * scoreStep)} disabled={!scoreStep} />
                    <TextInput
                        style={styles.scoreInput}
                        onChangeText={(n) => updateScoreStep(n ? parseInt(n.replace(/[^0-9]/g, ''), 10) : undefined)}
                        placeholder='Score Step'
                        value={scoreStep?.toString()}
                        keyboardType='number-pad'
                    />
                    <IconButton icon='plus' clickHandler={() => scoreStep && updateActivePlayerScore(scoreStep)} disabled={!scoreStep} />
                </View>

                <View style={sharedStyles.centeredContent}>
                    <Button title='End Turn' onPress={endPlayerTurn} color='#FCA47C'/>
                </View>
            </View>

            <View>
                <NavBar
                    leftButton={{ title: 'Game Settings', clickHandler: () => console.log('game settings')}}
                    rightButton={{ title: 'Players', clickHandler: () => console.log('players')}}
                />
            </View>
        </View>
    );
};

export default Game;

const styles = StyleSheet.create({
    gameContainer: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        height: '100%',
        width: '100%',
        justifyContent: 'space-between',
    },
    scoreInput: {
        fontFamily: 'Quicksand',
        fontSize: 24,
    }
});

import React, { useState } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { Player } from '../../model/player';
import { Settings } from '../../model/settings';
import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import GameTimer from './GameTimer';
import { sharedStyles } from '../../styles/shared';

interface GameProps {
    players: Player[];
    settings: Settings;
}
const Game = ({players, settings}: GameProps) => {
    const [activePlayer, setActivePlayer] = useState<Player>(players[0]);
    const [playerScores, updatePlayers] = useState<Player[]>(players);
    const [scoreStep, updateScoreStep] = useState<number>(settings?.defaultScoreStep || 1);

    return (
        <View style={styles.gameContainer}>
            <View>
                <View>
                    <NavBar
                        leftButton={{ title: 'New Game', clickHandler: () => console.log('new game')}}
                    />
                </View>
                <View style={sharedStyles.rowNoBorder}>
                    <Button title='Left' onPress={() => console.log('left player')} color='#FCA47C'/>
                    <GameTimer />
                    <Button title='Right' onPress={() => console.log('right player')} color='#FCA47C'/>
                </View>
                <View style={sharedStyles.rowNoBorder}>
                    <Header title={activePlayer.name}/>
                </View>

                <View style={sharedStyles.rowNoBorder}>
                    <Header title={activePlayer.score?.toString() || '0'}/>
                </View>
                <View style={sharedStyles.rowNoBorder}>
                    <Button title='Sub' onPress={() => setActivePlayer({ ...activePlayer, score: (activePlayer.score || 0) - scoreStep})} color='#FCA47C'/>
                    <Text style={styles.scoreStep}>{scoreStep}</Text>
                    <Button title='Add' onPress={() => setActivePlayer({ ...activePlayer, score: (activePlayer.score || 0) + scoreStep})} color='#FCA47C'/>
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
    scoreStep: {
        fontSize: 24,
    }
});

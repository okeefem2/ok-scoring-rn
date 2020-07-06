import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Player } from '../../model/player';
import { Settings } from '../../model/settings';
import Header from '../../components/Header';
import NavFooter from '../../components/NavFooter';
import GameTimer from './GameTimer';

interface GameProps {
    players: Player[];
    settings: Settings;
}
const Game = ({players, settings}: GameProps) => {
    const [activePlayer, setActivePlayer] = useState<Player>(players[0]);
    const [playerScores, updatePlayers] = useState<Player[]>(players);

    return (
        <View>
            <Header title={activePlayer.name}/>
            <Header title={activePlayer.score?.toString()}/>
            <GameTimer />
            <NavFooter
                leftButton={{ title: 'Game Settings', clickHandler: () => console.log('game settings')}}
                rightButton={{ title: 'Players', clickHandler: () => console.log('players')}}
            />

        </View>
    );
};

export default Game;

const styles = StyleSheet.create({});

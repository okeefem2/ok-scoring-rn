import React, { useState, useEffect } from 'react'
import { StyleSheet, Image, FlatList, Text } from 'react-native'
import PlayerInput from './PlayerInput'
import PlayerListItem from './PlayerListItem'
import { Player } from '../../model/player'
import Header from '../../components/Header'
import NavBar from '../../components/NavBar'
import GameSettings from './GameSettings'
import { sharedStyles } from '../../styles/shared'
import Game from '../game/Game'
import { Settings } from '../../model/settings'
import CenterContent from '../../components/CenterContent'
import { swap } from '../../util/array.util'
import { useDiceIcon } from '../../hooks/useDiceIcon'
import { GameState } from '../../model/game-score-history'
import GameHistory from '../game-history/GameHistory';
import { TimerProvider, useTimerState } from '../../providers/timer'
interface NewGameProps {
    dbAvailable: boolean;
}

export type SetSettingFunction = <K extends keyof Settings, T extends Settings[K]>(key: K, setting: T) => void;
const NewGame = ({ dbAvailable }: NewGameProps) => {
    const diceIcon = useDiceIcon();
    const [games, setGames] = useState<GameState[]>([]);
    const [previousPlayers, setPreviousPlayers] = useState<Player[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [showGameHistory, setShowGameHistory] = useState<boolean>(false);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [settings, setSettings] = useState({ rounds: undefined, startingScore: 0, defaultScoreStep: 1, scoreIncreases: true } as Settings);

    // Used to continue an existing game
    const [gameState, setGameState] = useState<GameState>();

    const setSetting: SetSettingFunction = (key, setting) => {
        setSettings({ ...settings, [key]: setting });
    }

    const addPlayer = (player: Player) => {
        console.log(player);
        if (player) {

            setPlayers([...players, player]);
        }
    };

    const deletePlayer = (playerKey: string) => {
        if (playerKey) {
            setPlayers(players.filter(p => p.key !== playerKey));
        }
    }

    const shiftPlayer = (playerKey: string, direction: 1 | -1) => {
        if (playerKey) {
            const playerIndex = players.findIndex(p => p.key === playerKey);
            let newIndex = playerIndex + direction;
            if (newIndex < 0) {
                newIndex = players.length - 1;
            } else if (newIndex >= players.length) {
                newIndex = 0;
            }

            setPlayers(swap(players, playerIndex, newIndex));
        }
    }

    if (showGameHistory) {
        return (
            <GameHistory
                games={games}
                back={() => setShowGameHistory(false)}
                continueGame={(game: GameState) => {
                    setGameState(game);
                    setShowGameHistory(false);
                    setGameStarted(true);
                }}
                copyGameSetup={(players: Player[], settings: Settings) => {
                    setPlayers(players);
                    setSettings(settings);
                    setShowGameHistory(false);
                }}
            />
        )
    }

    if (gameStarted) {
        return (
            <TimerProvider initialTimerValue={gameState?.duration}>
                <Game
                    game={gameState}
                    players={players}
                    settings={settings}
                    endGame={(game: GameState) => {
                        // TODO insert data into local db
                        const existingGame = games.findIndex(g => g.key === game.key);
                        if (existingGame !== -1) {
                            games.splice(existingGame, 1, game);
                        } else {
                            games.push(game);
                        }
                        setGames(games);
                        setGameStarted(false);

                        console.log('adding players', game.players);
                        // add new players
                        const newPlayers: Player[] = [];
                        game.players.forEach((p) => {
                            if (!previousPlayers.some((pp) => pp.key === p.key)) {
                                newPlayers.push(p);
                            }
                        });
                        setPreviousPlayers([ ...previousPlayers, ...newPlayers]);
                }}/>
            </TimerProvider>

        );
    }
    return (
        <>
            {
                dbAvailable &&
                <NavBar
                    leftButton={{ icon: 'book', title: 'Game History', clickHandler: () => setShowGameHistory(true)}}
                />
            }
            <CenterContent>
                <Image
                    source={require('../../assets/img/Logomakr-182120-225011/google.png')}
                    style={styles.logoImage}
                    resizeMode='contain'
                />
            </CenterContent>
            {
                showSettings ?
                <GameSettings settings={settings} setSetting={setSetting} exitSettings={() => setShowSettings(false)}/> :
                <>
                    <Header title='New Game'/>
                    <PlayerInput onAddPlayer={addPlayer} selectablePlayers={previousPlayers}/>
                    <FlatList
                        style={sharedStyles.scroll}
                        data={players}
                        ListEmptyComponent={
                            <Text style={[sharedStyles.bodyText, sharedStyles.centeredText, sharedStyles.mt25]}>Add Players To Get Started!</Text>
                        }
                        renderItem={
                            (itemData) =>
                                <PlayerListItem player={itemData.item} onDeletePlayer={deletePlayer} onShiftPlayer={shiftPlayer}/>
                        }
                    />
                    <NavBar
                        leftButton={{ icon: 'settings', title: 'Settings', clickHandler: () => setShowSettings(true)}}
                        rightButton={{ disabled: !players?.length, icon: diceIcon, title: 'Start Game', clickHandler: () => setGameStarted(true)}}
                    />
                </>
            }
        </>
    )
}

export default NewGame

const styles = StyleSheet.create({
    logoImage: {
        width: '80%',
        height: 150
    }
});

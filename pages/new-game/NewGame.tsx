import React, { useState, useEffect } from 'react'
import { StyleSheet, Image, FlatList, Text, View, TextInput } from 'react-native'
import PlayerInput from './PlayerInput'
import PlayerListItem from './PlayerListItem'
import { Player } from '../../model/player'
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
import { TimerProvider } from '../../providers/timer'
import { v4 as uuid } from 'react-native-uuid';
import { insertGame, fetchPlayers, insertPlayer, fetchGameStates } from '../../db/db'
import { colors } from '../../styles/colors'
import ModalSelector from 'react-native-modal-selector'

interface NewGameProps {
    dbAvailable: boolean;
}

export type SetSettingFunction = <K extends keyof Settings, T extends Settings[K]>(key: K, setting: T) => void;
const NewGame = ({ dbAvailable }: NewGameProps) => {
    const diceIcon = useDiceIcon();
    const [games, setGames] = useState<GameState[]>([]);
    const [previousPlayers, setPreviousPlayers] = useState<Player[]>([]);
    const [previousGames, setPreviousGames] = useState<string[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [showGameHistory, setShowGameHistory] = useState<boolean>(false);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [gameDescription, setGameDescription] = useState<string>();
    const [settings, setSettings] = useState({
        key: uuid(),
        // rounds: undefined,
        startingScore: 0,
        defaultScoreStep: 1,
        // scoreIncreases: true
    } as Settings);

    const loadPlayersAndGames = async () => {
        try {
            const players = await fetchPlayers();
            if (players?.length) {
                setPreviousPlayers(players);
            }
            const games = await fetchGameStates();
            if (games?.length) {
                setGames(games);
                setPreviousGames(Array.from(new Set(games.map(g => g.description))));
            }
        } catch(e) {
            console.log('Error loading players and games from db', e);
        }
    };
    useEffect(() => {
        loadPlayersAndGames();
    }, []);

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

    const endGame = async (game?: GameState) => {

        if (!game) {
            setGameStarted(false);
            setPlayers([]);
            setGameState(undefined);
            setSettings({
                key: uuid(),
                // rounds: undefined,
                startingScore: 0,
                defaultScoreStep: undefined,
                // scoreIncreases: true
            });
            return;
        }
        try {
            await insertGame(game);
        } catch(e) {
            console.log('error saving game', game, e);
        }
        const existingGame = games.findIndex(g => g.key === game.key);
        if (existingGame !== -1) {
            games.splice(existingGame, 1, game);
        } else {
            games.push(game);
        }
        setGames(games);
        setGameStarted(false);
        setPlayers([]);
        setGameState(undefined);
        setSettings({
            key: uuid(),
            // rounds: undefined,
            startingScore: 0,
            defaultScoreStep: 1,
            // scoreIncreases: true
        });

        // add new players
        const newPlayers: Player[] = [];
        for (let p of game.players) {
            if (!previousPlayers.some((pp) => pp.key === p.key)) {
                try {
                    await insertPlayer(p);
                    newPlayers.push(p);
                } catch(e) {
                    console.log('error saving player', p, e);
                }
            }
        }
        setPreviousPlayers([ ...previousPlayers, ...newPlayers]);
        if (!previousGames?.find(p => p === game.description)) {
            previousGames.push(game.description);
            setPreviousGames(previousGames);
        }
    };

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
                copyGameSetup={(players: Player[], settings: Settings, description: string) => {
                    setPlayers(players);
                    setSettings(settings);
                    setShowGameHistory(false);
                    setGameDescription(description);
                }}
            />
        )
    }

    if (gameStarted) {
        return (
            <TimerProvider initialTimerValue={gameState?.duration}>
                <Game
                    description={gameDescription as string}
                    game={gameState}
                    players={players}
                    settings={settings}
                    endGame={endGame}/>
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
                    source={require('../../assets/icon.png')}
                    style={styles.logoImage}
                    resizeMode='contain'
                />
            </CenterContent>
            {
                showSettings ?
                <GameSettings settings={settings} setSetting={setSetting} exitSettings={() => setShowSettings(false)}/> :
                <>
                    {/* <Header title='New Game'/> */}
                    <View style={sharedStyles.spacedRowBordered}>
                        <TextInput style={[sharedStyles.bodyText, sharedStyles.input]}
                            placeholder='What are we playing?'
                            autoCapitalize='words'
                            returnKeyType="done"
                            clearButtonMode="while-editing"
                            onChangeText={(description) => setGameDescription(description)} value={gameDescription}/>
                    </View>
                    <View style={sharedStyles.spacedRowNoBorder}>
                        {
                            previousGames?.length ?
                            <ModalSelector
                                initValueTextStyle={{ color: colors.primary }}
                                selectTextStyle={{ color: colors.primary }}
                                optionTextStyle={{ color: colors.secondary }}
                                cancelTextStyle={{ color: colors.tertiary }}
                                data={previousGames.map((g, i) => ({ key: i, label: g}))}
                                initValue="Previous Games"
                                onChange={(g) => setGameDescription(g.label)}
                            />
                            : <></>
                        }
                    </View>
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
                        rightButton={{ disabled: !players?.length || !gameDescription, icon: diceIcon, title: 'Start Game', clickHandler: () => setGameStarted(true)}}
                    />
                </>
            }
        </>
    )
}

export default NewGame;

const styles = StyleSheet.create({
    logoImage: {
        width: '80%',
        height: 150
    }
});

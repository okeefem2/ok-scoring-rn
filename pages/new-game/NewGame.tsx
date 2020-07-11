import React, { useState } from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import PlayerInput from './PlayerInput'
import PlayerListItem from './PlayerListItem'
import { Player } from '../../model/player'
import Header from '../../components/Header'
import NavBar from '../../components/NavBar'
import GameSettings from './GameSettings'
import { sharedStyles } from '../../styles/shared'
import Game from '../game/Game'

export type SetSettingFunction = <K extends keyof Settings, T extends Settings[K]>(key: K, setting: T) => void;
const NewGame = () => {

    const [players, setPlayers] = useState<Player[]>([]);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [settings, setSettings] = useState({ rounds: undefined, startingScore: 0, defaultScoreStep: 1, scoreIncreases: true } as Settings);

    const setSetting: SetSettingFunction = (key, setting) => {
        setSettings({ ...settings, [key]: setting });
    }

    const addPlayer = (name?: string) => {
        if (name) {
            setPlayers([...players, { key: Math.random().toString(), name}]);
        }
    };

    const deletePlayer = (playerKey: string) => {
        if (playerKey) {
            setPlayers(players.filter(p => p.key !== playerKey));
        }
    }
    return (
        <>
            {
                gameStarted ?
                    <Game players={players} settings={settings}/>
                :
                    <>
                        <Header title='New Game'/>
                        <PlayerInput onAddPlayer={addPlayer}/>
                        <FlatList
                        style={sharedStyles.scroll}
                        data={players}
                        renderItem={(itemData) => <PlayerListItem player={itemData.item} onDeletePlayer={deletePlayer}/>}/>
                        {/* <ScrollView style={styles.scroll} keyboardShouldPersistTaps='always'>
                        {players.map((p) => <View key={p} style={styles.row}><Text>{p}</Text></View>)}
                        <View style={styles.row}>
                            <TextInput placeholder='New Player' onChangeText={setNewPlayer} value={newPlayer}/>
                        </View>
                        <View style={styles.addButton}>
                            <Button title='Add Player' onPress={() => addPlayer(newPlayer)} color='#FCA47C'/>
                        </View>
                        </ScrollView> */}
                        <GameSettings setSetting={setSetting} settings={settings}/>
                        <NavBar rightButton={{ title: 'Start Game', clickHandler: () => setGameStarted(true)}}/>
                    </>
            }

        </>
    )
}

export default NewGame

const styles = StyleSheet.create({});

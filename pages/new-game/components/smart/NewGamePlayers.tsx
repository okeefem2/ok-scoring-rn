import React, { useContext } from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import { sharedStyles } from '../../../../styles/shared'
import { observer } from 'mobx-react';
import { playerHistoryContext } from '../../../../state/players-history.store'
import { gameContext } from '../../../../state/game.store'
import PlayerListItem from '../dumb/PlayerListItem';
import PlayerInput from '../dumb/PlayerInput';

const NewGamePlayers = () => {
    const { playerHistory } = useContext(playerHistoryContext);
    const { players, addPlayer, deletePlayer, shiftPlayer } =  useContext(gameContext);
    return (
        <>
            <PlayerInput onAddPlayer={addPlayer} selectablePlayers={playerHistory}/>
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
        </>
    )
}

export default observer(NewGamePlayers);

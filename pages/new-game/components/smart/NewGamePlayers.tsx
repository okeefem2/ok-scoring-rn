import React, { useContext } from 'react'
import { Text, FlatList } from 'react-native'
import { sharedStyles } from '../../../../styles/shared'
import { observer } from 'mobx-react';
import { playerHistoryContext } from '../../../../state/players-history.store'
import { gameContext } from '../../../../state/game.store'
import PlayerListItem from '../dumb/PlayerListItem';
import AddPlayer from '../dumb/AddPlayer';

const NewGamePlayers = () => {
    const { favoritePlayers } = useContext(playerHistoryContext);
    const { players, addOrReplacePlayer, deletePlayer, shiftPlayer } =  useContext(gameContext);
    return (
        <>
            <AddPlayer onAddPlayer={addOrReplacePlayer} selectablePlayers={favoritePlayers}/>
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

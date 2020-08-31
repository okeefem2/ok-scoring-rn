import React, { useState } from 'react'
import { sharedStyles } from '../../styles/shared'
import { View, TextInput, StyleSheet, Keyboard } from 'react-native'
import IconButton from '../../components/IconButton';
import { Player } from '../../model/player';
import { v4 as uuid } from 'react-native-uuid';
import ModalSelector from 'react-native-modal-selector';
import { colors } from '../../styles/colors';

interface PlayerInputProps {
    onAddPlayer: (player: Player) => void,
    selectablePlayers?: Player[];
}

function PlayerInput({ onAddPlayer, selectablePlayers }: PlayerInputProps) {
    const [newPlayer, setNewPlayer] = useState<Partial<Player>>({});

    const addPlayer = (player: Partial<Player>) => {
        if (!player?.name) {
            return;
        }
        if (!player.key) {
            player.key = uuid();
        }
        onAddPlayer(player as Player);
        setNewPlayer({});
        Keyboard.dismiss();
    }

    return (
        <>
            <View style={sharedStyles.spacedRowBordered}>
                <TextInput
                    autoCapitalize='words'
                    style={[sharedStyles.bodyText, sharedStyles.input]}
                    placeholder='New Player'
                    returnKeyType="done"
                    clearButtonMode="while-editing"
                    onSubmitEditing={() => {
                        console.log('submit');
                        addPlayer(newPlayer)
                    }}
                    onChangeText={(name) => setNewPlayer({ name })}
                    value={newPlayer?.name}
                    />
            </View>
            <View style={sharedStyles.spacedRowNoBorder}>
                {/* <View style={styles.addButton}>
                    <IconButton icon={'account'} title={'Add Player'} clickHandler={addPlayer} iconSide='left'/>
                </View> */}
                {
                    selectablePlayers?.length ?
                    <ModalSelector
                        initValueTextStyle={{ color: colors.primary }}
                        selectTextStyle={{ color: colors.primary }}
                        optionTextStyle={{ color: colors.secondary }}
                        cancelTextStyle={{ color: colors.tertiary }}
                        data={selectablePlayers}
                        initValue="Select A Player"
                        onChange={(player: Player) => {
                            console.log('selected player!');
                            setNewPlayer(player);
                        }}
                        onModalClose={() => addPlayer(newPlayer)}
                        keyExtractor= {player => player.key}
                        labelExtractor= {player => player.name}
                        selectedKey={newPlayer?.key}
                    />
                    : <></>
                }
            </View>
        </>
    );
}

export default PlayerInput;

const styles = StyleSheet.create({
    addButton: {
        margin: 0,
        padding: 15,
    },
});

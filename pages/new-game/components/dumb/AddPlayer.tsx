import React, { useState } from 'react'
import { View, TextInput, Keyboard } from 'react-native'
import { v4 as uuid } from 'react-native-uuid';
import ModalSelector from 'react-native-modal-selector';
import { Player } from '../../../../model/player';
import { sharedStyles } from '../../../../styles/shared';
import { colors } from '../../../../styles/colors';
import IconButton from '../../../../components/IconButton';
import { focusInputOnCreation } from '../../../../hooks/focusInputOnCreation';

interface AddPlayerProps {
    onAddPlayer: (player: Player) => void,
    selectablePlayers?: Player[];
}

function AddPlayer({ onAddPlayer, selectablePlayers }: AddPlayerProps) {
    const [newPlayer, setNewPlayer] = useState<Partial<Player>>({});
    const [showInput, setShowInput] = useState(false);
    const focusInput = focusInputOnCreation();

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
            {
                showInput ?
                <View style={sharedStyles.spacedRowBordered}>
                    <TextInput
                        autoCapitalize='words'
                        style={[sharedStyles.bodyText, sharedStyles.input]}
                        placeholder='New Player'
                        returnKeyType='done'
                        clearButtonMode="while-editing"
                        autoCorrect={false}
                        onSubmitEditing={() => {
                            if (!!newPlayer) {
                                addPlayer(newPlayer);
                            }
                            setShowInput(false);
                        }}
                        onChangeText={(name) => setNewPlayer({ name })}
                        value={newPlayer?.name}
                        ref={(input: TextInput) => focusInput(input)}
                    />
                </View> : <></>
            }

            <View style={[sharedStyles.spacedRowNoBorder]}>
                {
                    selectablePlayers?.length ?
                    <ModalSelector
                        initValueTextStyle={{ color: colors.primary }}
                        selectTextStyle={{ color: colors.primary }}
                        optionTextStyle={{ color: colors.secondary }}
                        cancelTextStyle={{ color: colors.tertiary }}
                        data={selectablePlayers}
                        initValue="Favorite Players"
                        onChange={setNewPlayer}
                        onModalOpen={() => {
                            Keyboard.dismiss();
                        }}
                        onModalClose={() => {
                            addPlayer(newPlayer);
                            setShowInput(false);
                        }}
                        keyExtractor= {player => player.key}
                        labelExtractor= {player => player.name}
                        selectedKey={newPlayer?.key}
                    />
                    : <></>
                }
                {
                    !showInput ?
                        <IconButton icon='account-plus-outline' title='Add Player' alignSelf={'center'} clickHandler={() => {
                            setShowInput(true)
                        }}/> :
                        <></>
                }
            </View>
        </>
    );
}

export default AddPlayer;

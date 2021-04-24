import React, { useState } from 'react'
import { View, Keyboard } from 'react-native'
import ModalSelector from 'react-native-modal-selector';
import { Player } from '../../../../model/player';
import { sharedStyles } from '../../../../styles/shared';
import { colors } from '../../../../styles/colors';
import IconButton from '../../../../components/IconButton';
import PromptModal from '../../../../components/PromptModal';

interface AddPlayerProps {
    onAddPlayer: (player: Player) => void,
    selectablePlayers?: Player[];
}

function AddPlayer({ onAddPlayer, selectablePlayers }: AddPlayerProps) {
    const [newPlayer, setNewPlayer] = useState<Player>();
    const [showInput, setShowInput] = useState(false);

    return (
        <>
            {/* TODO fuzzy search? */}
            <PromptModal
                modalVisible={!!showInput}
                title={`New Player`}
                inputProps={{
                    placeholder: 'Player Name'
                }}
                onCancel={() => setShowInput(false)}
                onSave={(value) => {
                    if (!!value) {
                        onAddPlayer({ name: value } as Player);
                        setShowInput(false);
                    }
                }} />
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
                            onModalClose={() => {
                                onAddPlayer(newPlayer as Player);
                                setNewPlayer(undefined);
                            }}
                            keyExtractor={player => player.key}
                            labelExtractor={player => player.name}
                            selectedKey={newPlayer?.key}
                        />
                        : <></>
                }
                {
                    !showInput ?
                        <IconButton icon='account-plus-outline' title='Add Player' alignSelf={'center'} clickHandler={() => {
                            setShowInput(true)
                        }} /> :
                        <></>
                }
            </View>
        </>
    );
}

export default AddPlayer;

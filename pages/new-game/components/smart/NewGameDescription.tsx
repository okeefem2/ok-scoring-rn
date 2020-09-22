import React, { useContext, useState } from 'react'
import { View, TextInput, Keyboard } from 'react-native'
import { sharedStyles } from '../../../../styles/shared'
import ModalSelector from 'react-native-modal-selector'
import { colors } from '../../../../styles/colors'
import { gameContext } from '../../../../state/game.store'
import { gameHistoryContext } from '../../../../state/game-history.store'
import { observer } from 'mobx-react'
import { focusInputOnCreation } from '../../../../hooks/focusInputOnCreation'
import IconButton from '../../../../components/IconButton'

const NewGameDescription = () => {
    const {setGameDescription} = useContext(gameContext);
    const { previousGamesSelectable } =  useContext(gameHistoryContext);

    const [tempDescription, setTempDescription] = useState('');
    const [showInput, setShowInput] = useState(false);
    const focusInput = focusInputOnCreation();

    return (
        <>
        {
            showInput ?
            <View style={sharedStyles.spacedRowBordered}>
                <TextInput style={[sharedStyles.bodyText, sharedStyles.input]}
                    placeholder='What are we playing?'
                    autoCapitalize='words'
                    returnKeyType="done"
                    clearButtonMode="while-editing"
                    autoCorrect={false}
                    onEndEditing={() => {
                        setGameDescription(tempDescription as string);
                        setTempDescription('');
                        setShowInput(false);
                    }}
                    onChangeText={(description) => setTempDescription(description)}
                    value={tempDescription}
                    ref={(input: TextInput) => focusInput(input)}
                />
            </View> : <></>
        }

            <View style={sharedStyles.spacedRowNoBorder}>
                {
                    previousGamesSelectable?.length ?
                    <ModalSelector
                        initValueTextStyle={{ color: colors.primary }}
                        selectTextStyle={{ color: colors.primary }}
                        optionTextStyle={{ color: colors.secondary }}
                        cancelTextStyle={{ color: colors.tertiary }}
                        data={previousGamesSelectable}
                        initValue="Previous Games"
                        selectedKey={tempDescription}
                        onModalOpen={() => {
                            Keyboard.dismiss();
                        }}
                        onChange={({ label }) => {
                            setTempDescription(label);
                        }}
                        onModalClose={() => {
                            if (tempDescription) {
                                setGameDescription(tempDescription);
                                setTempDescription('');
                            }
                        }}
                    />
                    : <></>
                }
                {
                    !showInput ?
                        <IconButton icon='pencil-outline' title='Edit Game' alignSelf={'center'} clickHandler={() => {
                            setShowInput(true)
                        }}/> :
                        <></>
                }
            </View>
        </>
    )
}

export default observer(NewGameDescription);

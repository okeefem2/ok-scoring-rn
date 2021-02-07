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
import { favoriteGamesContext } from '../../../../state/favorite-games.store'

const NewGameDescription = () => {
    const { setGameDescription, description, setFavorite } = useContext(gameContext);
    const { favoriteGames } = useContext(favoriteGamesContext);

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
                            onSubmitEditing={() => {
                                if (!!tempDescription) {
                                    setFavorite(favoriteGames);
                                    setGameDescription(tempDescription as string);
                                    setTempDescription('');
                                }
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
                    favoriteGames?.length ?
                        <ModalSelector
                            initValueTextStyle={{ color: colors.primary }}
                            selectTextStyle={{ color: colors.primary }}
                            optionTextStyle={{ color: colors.secondary }}
                            cancelTextStyle={{ color: colors.tertiary }}
                            data={favoriteGames}
                            initValue="Favorite Games"
                            selectedKey={tempDescription}
                            labelExtractor={({ description }) => description}
                            onModalOpen={() => {
                                Keyboard.dismiss();
                            }}
                            onChange={({ description }) => {
                                setTempDescription(description);
                            }}
                            onModalClose={() => {
                                if (tempDescription) {
                                    setGameDescription(tempDescription);
                                    setFavorite(favoriteGames);
                                    setTempDescription('');
                                    setShowInput(false);
                                }
                            }}
                        />
                        : <></>
                }
                {
                    !showInput ?
                        <IconButton icon='pencil-outline' title='Edit Game Name' alignSelf={'center'} clickHandler={() => {
                            if (description) {
                                setTempDescription(description);
                            }
                            setShowInput(true)
                        }} /> :
                        <></>
                }
            </View>
        </>
    )
}

export default observer(NewGameDescription);

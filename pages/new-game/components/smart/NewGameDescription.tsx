import React, { useContext, useState } from 'react'
import { View, Keyboard } from 'react-native'
import { sharedStyles } from '../../../../styles/shared'
import ModalSelector from 'react-native-modal-selector'
import { colors } from '../../../../styles/colors'
import { gameContext } from '../../../../state/game.store'
import { observer } from 'mobx-react'
import IconButton from '../../../../components/IconButton'
import { favoriteGamesContext } from '../../../../state/favorite-games.store'
import PromptModal from '../../../../components/PromptModal'

const NewGameDescription = () => {
    const { setGameDescription, description, setFavorite } = useContext(gameContext);
    const { favoriteGames } = useContext(favoriteGamesContext);

    const [tempDescription, setTempDescription] = useState('');
    const [showInput, setShowInput] = useState(false);

    return (
        <>
            <PromptModal
                modalVisible={!!showInput}
                inputProps={{
                    placeholder: 'Game Description',
                    autoCapitalize: 'words',
                }}
                title={`What are we playing?`}
                onCancel={() => setShowInput(false)}
                onSave={(value) => {
                    if (!!value) {
                        setGameDescription(value);
                        setShowInput(false);
                    }
                }} />

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
                        <IconButton icon='pencil-outline' title='Game Name' alignSelf={'center'} clickHandler={() => {
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

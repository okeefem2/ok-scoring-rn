import React, { useContext, useState } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import { sharedStyles } from '../../../../styles/shared'
import ModalSelector from 'react-native-modal-selector'
import { colors } from '../../../../styles/colors'
import { gameContext } from '../../../../state/game.store'
import { gameHistoryContext } from '../../../../state/game-history.store'

const NewGameDescription = () => {
    const {gameDescription, setGameDescription} = useContext(gameContext);
    const { previousGames } =  useContext(gameHistoryContext);

    const [tempDescription, setTempDescription] = useState(gameDescription);
    return (
        <>
            <View style={sharedStyles.spacedRowBordered}>
                <TextInput style={[sharedStyles.bodyText, sharedStyles.input]}
                    placeholder='What are we playing?'
                    autoCapitalize='words'
                    returnKeyType="done"
                    clearButtonMode="while-editing"
                    autoCorrect={false}
                    onEndEditing={() => setGameDescription(tempDescription as string)}
                    onChangeText={(description) => setTempDescription(description)} value={tempDescription}/>
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
        </>
    )
}

export default NewGameDescription

const styles = StyleSheet.create({})

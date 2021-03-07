import React, { useState } from 'react'
import { KeyboardType, Modal, StyleSheet, Text, TextInput, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { colors } from '../styles/colors'
import { sharedStyles } from '../styles/shared'
import BodyText from './BodyText'
import Header from './Header'
import IconButton from './IconButton'

type PromptModalProps = {
    modalVisible: boolean;
    title: string;
    placeHolder: string;
    keyboardType: KeyboardType;
    onCancel: () => void;
    onSave: (value?: string) => void;
}

const PromptModal = ({
    modalVisible,
    title,
    placeHolder,
    keyboardType = 'default',
    onCancel,
    onSave
}: PromptModalProps) => {
    const [tempValue, setTempValue] = useState<string | undefined>();

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={[sharedStyles.p20, { backgroundColor: colors.greyMidTrans, height: '100%' }]}>
                    <View style={[{ backgroundColor: colors.white }, sharedStyles.p20, sharedStyles.mt25]}>
                        <Text style={[sharedStyles.centeredText, sharedStyles.bodyText]}>{title}</Text>
                        <TextInput
                            style={[
                                styles.input
                            ]}
                            placeholder={placeHolder}
                            onChangeText={(n) => !!n && setTempValue(n)}
                            value={tempValue?.toString()}
                            autoFocus={true}
                            autoCorrect={false}
                            returnKeyType="done"
                            clearTextOnFocus={true}
                            keyboardType={keyboardType} />
                        <View style={[sharedStyles.spacedEvenlyNoBorder, { width: '100%' }]}>
                            <IconButton title={'Cancel'} clickHandler={onCancel} color={colors.tertiary} />
                            <IconButton title={'Save'} clickHandler={() => {
                                onSave(tempValue)
                            }} color={colors.primary} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default PromptModal

const styles = StyleSheet.create({
    input: {
        fontFamily: 'Quicksand',
        borderBottomColor: colors.greyMid,
        borderBottomWidth: 1,
        textAlign: 'center',
        margin: 20,
        padding: 5,
    }
})

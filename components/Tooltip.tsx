import React, { useState } from 'react'
import { Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { WrapperComponentProps } from '../model/component';
import { sharedStyles } from '../styles/shared';

type TooltipProps = {
    text: string;
}

// TODO this is in progress
const Tooltip = ({children, text}: TooltipProps & WrapperComponentProps) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View>
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPressOut={() => {setModalVisible(false)}}
                >
                    <Text style={[ sharedStyles.bodyText ]}>
                        {text}
                    </Text>
                </TouchableOpacity>
            </Modal>
            <TouchableOpacity
                    onLongPress={() => {setModalVisible(true)}}
                >
                {children}
            </TouchableOpacity>
        </View>
    )
}

export default Tooltip;

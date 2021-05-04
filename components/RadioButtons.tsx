import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors } from '../styles/colors';
import { sharedStyles } from '../styles/shared';

export interface RadioItem {
    onPress: () => void;
    text: string;
    selected: boolean;
}

export interface RadioButtonProps {
    items: RadioItem[];
}

const RadioButtons = ({ items }: RadioButtonProps) => {
    return <View style={sharedStyles.column}>
        {
            items.map((item, i) => (
                <View style={styles.radioButtonContainer} key={`${item.text}-${i}`}>
                    <TouchableOpacity onPress={item.onPress} style={styles.radioButton}>
                        {item.selected ? <View style={styles.radioButtonIcon} /> : <></>}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={item.onPress}>
                        <Text style={[styles.radioButtonText, sharedStyles.bodyText]}>{item.text}</Text>
                    </TouchableOpacity>
                </View>
            ))
        }
    </View>
}

export default RadioButtons;

const styles = StyleSheet.create({
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 45,
        marginBottom: 15,
    },
    radioButton: {
        height: 25,
        width: 25,
        backgroundColor: colors.greyLight,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.greyMid,
        alignItems: 'center',
        justifyContent: 'center'
    },
    radioButtonIcon: {
        height: 18,
        width: 18,
        borderRadius: 9,
        backgroundColor: colors.primary,
    },
    radioButtonText: {
        marginLeft: 16
    }
});

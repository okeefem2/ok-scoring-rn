import React from 'react'
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import BodyText from './BodyText';

export interface ButtonConfig {
    icon?: string;
    disabled?: boolean;
    iconSide?: 'left' | 'right';
    clickHandler: () => void;
    title?: string;
}
const IconButton = ({icon, iconSide = 'left', clickHandler, title, disabled = false}: ButtonConfig) => {
    const textStyles: any[] = [styles.buttonText];
    if (disabled) {
        textStyles.push(styles.disabled);
    }
    return (
        <TouchableOpacity onPress={() => !disabled && clickHandler()} disabled={disabled}>
            <View style={styles.buttonRow}>
                { !!icon && iconSide === 'left' ? <MaterialCommunityIcons name={icon} size={24} color={disabled ? colors.greyMid : colors.primary} /> : <></>}
                { !!title ? <Text style={textStyles}>{title}</Text> : <></> }
                { !!icon && iconSide === 'right'  ? <MaterialCommunityIcons name={icon} size={24} color={disabled ? colors.greyMid : colors.primary} /> : <></>}
            </View>
        </TouchableOpacity>

    )
}

export default IconButton

const styles = StyleSheet.create({
    buttonRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontFamily: 'Quicksand',
        fontSize: 18,
        color: colors.primary,
        marginRight: 5,
        marginLeft: 5,
    },
    disabled: {
        color: colors.greyMid
    }
});

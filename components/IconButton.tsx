import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

export interface ButtonConfig {
    icon?: string;
    disabled?: boolean;
    iconSide?: 'left' | 'right';
    clickHandler: () => void;
    title?: string;
    size?: number;
    color?: string;
    width?: string
    alignSelf?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' | 'auto' | undefined;
    backgroundColor?: string;
}
const IconButton = ({
    icon,
    iconSide = 'left',
    clickHandler,
    title,
    disabled = false,
    size = 24,
    color = colors.primary,
    width,
    alignSelf = 'center',
    backgroundColor,
}: ButtonConfig) => {
    const textStyles: any[] = [styles.buttonText];
    if (backgroundColor) {
        textStyles.push({ backgroundColor });
    }
    if (disabled) {
        textStyles.push(styles.disabled);
    }
    return (
        <View style={{ alignSelf: alignSelf, display: 'flex', width: width }}>
            <TouchableOpacity onPress={() => !disabled && clickHandler()} disabled={disabled} style={{ width: width, }}>
                <View style={styles.buttonRow}>
                    { !!icon && iconSide === 'left' ? <MaterialCommunityIcons name={icon} size={size} color={disabled ? colors.greyMid : color} /> : <></>}
                    { !!title ? <Text style={[textStyles, { color: disabled ? colors.greyMid : color }]}>{title}</Text> : <></> }
                    { !!icon && iconSide === 'right'  ? <MaterialCommunityIcons name={icon} size={size} color={disabled ? colors.greyMid : color} /> : <></>}
                </View>
            </TouchableOpacity>
        </View>
    );
}

export default IconButton

const styles = StyleSheet.create({
    buttonRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontFamily: 'Quicksand',
        fontSize: 20,
        marginRight: 5,
        marginLeft: 5,
    },
    disabled: {
        color: colors.greyMid
    }
});

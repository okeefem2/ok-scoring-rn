import React, { ReactNode } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'

export interface ButtonConfig {
    icon?: string;
    clickHandler: () => void;
    title: string;
}
interface FooterProps {
    leftButton?: ButtonConfig;
    rightButton?: ButtonConfig;
}
const NavFooter = ({ leftButton, rightButton } : FooterProps) => {
    return (
        <View style={styles.footerContainer}>
            <View style={styles.footerButtonContainerLeft}>
                {
                    leftButton ? <Button title={leftButton.title} onPress={leftButton.clickHandler} color='#FCA47C'/> : <></>
                }
            </View>
            <View style={styles.footerButtonContainerRight}>
                {
                    rightButton ? <Button title={rightButton.title} onPress={rightButton.clickHandler} color='#FCA47C'/> : <></>
                }
            </View>
        </View>
    )
}

export default NavFooter;

const styles = StyleSheet.create({
    footerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerButtonContainerLeft: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '50%',
    },
    footerButtonContainerRight: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '50%',
    }
});

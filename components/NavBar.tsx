import React, { ReactNode } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'

export interface ButtonConfig {
    icon?: string;
    clickHandler: () => void;
    title: string;
}
interface NavBarProps {
    leftButton?: ButtonConfig;
    rightButton?: ButtonConfig;
}
const NavBar = ({ leftButton, rightButton } : NavBarProps) => {
    return (
        <View style={styles.navBarContainer}>
            <View style={styles.navBarButtonContainerLeft}>
                {
                    leftButton ? <Button title={leftButton.title} onPress={leftButton.clickHandler} color='#FCA47C'/> : <></>
                }
            </View>
            <View style={styles.navBarButtonContainerRight}>
                {
                    rightButton ? <Button title={rightButton.title} onPress={rightButton.clickHandler} color='#FCA47C'/> : <></>
                }
            </View>
        </View>
    )
}

export default NavBar;

const styles = StyleSheet.create({
    navBarContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    navBarButtonContainerLeft: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '50%',
    },
    navBarButtonContainerRight: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '50%',
    }
});

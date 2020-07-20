import React, { ReactNode } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import IconButton, { ButtonConfig } from './IconButton';

interface NavBarProps {
    leftButton?: ButtonConfig;
    rightButton?: ButtonConfig;
}
const NavBar = ({ leftButton, rightButton } : NavBarProps) => {
    return (
        <View style={styles.navBarContainer}>
            <View style={styles.navBarButtonContainerLeft}>
                {
                    leftButton ? <IconButton disabled={leftButton.disabled} icon={leftButton.icon} title={leftButton.title} clickHandler={leftButton.clickHandler} iconSide='left' /> : <></>
                }
            </View>
            <View style={styles.navBarButtonContainerRight}>
                {
                    rightButton ? <IconButton disabled={rightButton.disabled} icon={rightButton.icon} title={rightButton.title} clickHandler={rightButton.clickHandler} iconSide='right' /> : <></>
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

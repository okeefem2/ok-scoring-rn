import React from 'react'
import { StyleSheet, Text, View } from 'react-native'


interface HeaderProps {
    title?: string;
}

const Header = ({ title }: HeaderProps) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerText}>{ title }</Text>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    header: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    headerText: {
        fontSize: 36,
    }
})

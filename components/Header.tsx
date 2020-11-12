import React from 'react'
import { StyleSheet, Text, View } from 'react-native'


interface HeaderProps {
    title?: string;
    fontSize?: number;
}

const Header = ({ title, fontSize = 30 }: HeaderProps) => {
    return (
        <View style={[styles.header]}>
            <Text style={[styles.headerText, { fontSize }]}>{ title }</Text>
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
        textAlign: 'center',
        flexWrap: 'wrap',
    },
    headerText: {
        fontFamily: 'Quicksand',
        textAlign: 'center',
    }
})

import React from 'react'
import { Text, View } from 'react-native'
import { sharedStyles } from '../styles/shared'

interface HeaderProps {
    title?: string;
    fontSize?: number;
}

const Header = ({ title, fontSize = 30 }: HeaderProps) => {
    return (
        <View style={[sharedStyles.centeredContent]}>
            <Text style={[sharedStyles.bodyText, sharedStyles.centeredText, { fontSize }]}>{ title }</Text>
        </View>
    )
}

export default Header;

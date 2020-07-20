import React, { ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { sharedStyles } from '../styles/shared'
import { WrapperComponentProps } from '../model/component';

const BodyText = ({children}: WrapperComponentProps) => {
    return (
        <Text style={sharedStyles.bodyText}>{ children }</Text>
    );
}

export default BodyText

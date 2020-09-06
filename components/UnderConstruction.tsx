import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { sharedStyles } from '../styles/shared';
import { SvgXml } from "react-native-svg";
import { workInProgressXML } from '../assets/work-in-progress';

const UnderConstruction = () => {
    return (
        <View style={[sharedStyles.column]}>
            <View style={sharedStyles.centeredContent}>
                <SvgXml xml={workInProgressXML} width={'150'} height={'150'}/>
            </View>
            <Text style={[sharedStyles.bodyText, sharedStyles.centeredText]}>
                Work in progress, Come back soon for more cool features!
            </Text>
        </View>
    )
}

export default UnderConstruction

import React from 'react';
import { View } from 'react-native';
import { WrapperComponentProps } from '../model/component';
import { sharedStyles } from '../styles/shared';

const CenterContent = ({children}: WrapperComponentProps) => {
    return (
        <View style={sharedStyles.centeredContent}>
            {children}
        </View>
    );
}

export default CenterContent;

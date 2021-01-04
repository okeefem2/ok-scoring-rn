import React from 'react';
import { Text } from 'react-native';
import { sharedStyles } from '../styles/shared';
import { WrapperComponentProps } from '../model/component';

const BodyText = ({children}: WrapperComponentProps) => {
    return (
        <Text style={sharedStyles.bodyText}>{ children }</Text>
    );
}

export default BodyText;

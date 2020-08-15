import React, { ReactNode, useState } from 'react'
import { StyleSheet, Text, View, Switch } from 'react-native'
import { sharedStyles } from '../../styles/shared';
import { colors } from '../../styles/colors';
import { WrapperComponentProps } from '../../model/component';
import BodyText from '../../components/BodyText';

interface SettingsSectionProps extends WrapperComponentProps {
    sectionTitle: string;
}

const SettingsSection = ({ sectionTitle, children }: SettingsSectionProps) => {
    const [showSection, toggleShowSection] = useState(false);

    const onToggleShowSection = (toggled: boolean) => {
        toggleShowSection(toggled);
    }

    return (
        <View style={styles.sectionContainer}>
            <View style={sharedStyles.spacedRowBordered}>
                <BodyText>{ sectionTitle }</BodyText>
                <Switch
                    trackColor={{ false: colors.greyMid, true: colors.primaryLight }}
                    thumbColor={showSection ? colors.primaryLight : colors.greyLight}
                    ios_backgroundColor={colors.greyMid}
                    onValueChange={onToggleShowSection}
                    value={showSection}
                />
            </View>
            <>
                { showSection && children }
            </>
        </View>
    )
}

export default SettingsSection

const styles = StyleSheet.create({
    sectionContainer: {
        display: 'flex',
        width: '100%',
    }
})

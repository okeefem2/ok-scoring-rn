import React, {useState} from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput, Switch } from 'react-native'
import SettingsSection from './SettingsSection';
import Header from '../../components/Header';
import { sharedStyles } from '../../styles/shared';
import { colors } from '../../styles/colors';
import { SetSettingFunction } from './NewGame';

interface GameSettingsProps {
    settings: Settings;
    setSetting: SetSettingFunction;
}
const GameSettings = ({ settings, setSetting }: GameSettingsProps) => {

    return (
        <>
            <Header title='Settings'/>
            <ScrollView style={sharedStyles.scroll} keyboardShouldPersistTaps='always'>
                <SettingsSection sectionTitle='Round Settings'>
                    <View style={sharedStyles.rowNoBorder}>
                        <Text>Round Limit</Text>
                        <TextInput
                            placeholder='∞'
                            onChangeText={(n) => setSetting('rounds', n ? parseInt(n.replace(/[^0-9]/g, ''), 10) : undefined)}
                            value={settings?.rounds?.toString()}
                            autoCorrect={false}
                            keyboardType='number-pad'/>
                    </View>
                    <View style={sharedStyles.rowNoBorder}>
                        <Text>Round Time Limit</Text>
                        <TextInput
                            placeholder='∞'
                            onChangeText={(n) => setSetting('roundTimeLimit', n ? parseInt(n.replace(/[^0-9]/g, ''), 10) : undefined)}
                            value={settings?.roundTimeLimit?.toString()}
                            autoCorrect={false}
                            keyboardType='number-pad'/>
                    </View>
                    <View style={sharedStyles.rowNoBorder}>
                        <Text>Round Time Limit</Text>
                        <TextInput
                            placeholder='N/A'
                            onChangeText={(n) => setSetting('par', n ? parseInt(n.replace(/[^0-9]/g, ''), 10) : undefined)}
                            value={settings?.par?.toString()}
                            autoCorrect={false}
                            keyboardType='number-pad'/>
                    </View>
                </SettingsSection>
                <SettingsSection sectionTitle='Score Settings'>
                    <View style={sharedStyles.rowNoBorder}>
                        <Text>Starting Score</Text>
                        <TextInput
                            placeholder='0'
                            onChangeText={(n) => setSetting('startingScore', n ? parseInt(n.replace(/[^0-9]/g, ''), 10) : 0)}
                            value={settings?.startingScore?.toString()}
                            autoCorrect={false}
                            keyboardType='number-pad'/>
                    </View>
                    <View style={sharedStyles.rowNoBorder}>
                        <Text>Default Score Step</Text>
                        <TextInput
                            placeholder='1'
                            onChangeText={(n) => setSetting('defaultScoreStep', n ? parseInt(n.replace(/[^0-9]/g, ''), 10) : 1)}
                            value={settings?.defaultScoreStep?.toString()}
                            autoCorrect={false}
                            keyboardType='number-pad'/>
                    </View>
                    <View style={sharedStyles.rowNoBorder}>
                        <Text>Score Increases By Default</Text>
                        <Switch
                            trackColor={{ false: colors.greyMid, true: colors.primaryLight }}
                            thumbColor={settings?.scoreIncreases ? colors.primaryLight : colors.greyLight}
                            ios_backgroundColor={colors.greyMid}
                            onValueChange={(n: boolean) => setSetting('scoreIncreases', n)}
                            value={settings?.scoreIncreases}
                        />
                    </View>
                </SettingsSection>
            </ScrollView>
        </>
    );
}

export default GameSettings;

const styles = StyleSheet.create({});

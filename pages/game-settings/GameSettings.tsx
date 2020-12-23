import React, { useContext } from 'react'
import { View, ScrollView, TextInput, Switch } from 'react-native'
import Header from '../../components/Header';
import { sharedStyles } from '../../styles/shared';
import BodyText from '../../components/BodyText';
import NavBar from '../../components/NavBar';
import UnderConstruction from '../../components/UnderConstruction';
import { gameContext } from '../../state/game.store';
import { observer } from 'mobx-react';
import SettingsSection from './components/dumb/SettingsSection';
import { PageNavigationProps } from '../../navigation';
import { colors } from '../../styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const GameSettings = ({ navigation: { goBack }}: PageNavigationProps<typeof RouteName>) => {

    const { settings, setSetting } = useContext(gameContext);

    return (
        <SafeAreaView style={sharedStyles.pageContainer}>
            <NavBar
                leftButton={{ icon: 'chevron-left', title: 'Back', clickHandler: goBack }}
            />
            <Header title='Game Settings'/>
            <ScrollView style={sharedStyles.scroll} keyboardShouldPersistTaps='always'>
                {/* <SettingsSection sectionTitle='Round Settings'>
                    <View style={sharedStyles.rowNoBorder}>
                        <BodyText>Round Limit</BodyText>
                        <TextInput
                            placeholder='∞'
                            onChangeText={(n) => setSetting('rounds', n ? parseInt(n.replace(/[^0-9]/g, ''), 10) : undefined)}
                            value={settings?.rounds?.toString()}
                            autoCorrect={false}
                            keyboardType='number-pad'/>
                    </View>
                    <View style={sharedStyles.rowNoBorder}>
                        <BodyText>Round Time Limit</BodyText>
                        <TextInput
                            placeholder='∞'
                            onChangeText={(n) => setSetting('roundTimeLimit', n ? parseInt(n.replace(/[^0-9]/g, ''), 10) : undefined)}
                            value={settings?.roundTimeLimit?.toString()}
                            autoCorrect={false}
                            keyboardType='number-pad'/>
                    </View>
                    <View style={sharedStyles.rowNoBorder}>
                        <BodyText>Round Time Limit</BodyText>
                        <TextInput
                            placeholder='N/A'
                            onChangeText={(n) => setSetting('par', n ? parseInt(n.replace(/[^0-9]/g, ''), 10) : undefined)}
                            value={settings?.par?.toString()}
                            autoCorrect={false}
                            keyboardType='number-pad'/>
                    </View>
                </SettingsSection> */}
                <SettingsSection sectionTitle='Score Settings'>
                    <View style={sharedStyles.spacedRowNoBorder}>
                        <BodyText>Starting Score</BodyText>
                        <TextInput
                            placeholder='0'
                            onChangeText={(n) => setSetting('startingScore', n ? parseInt(n.replace(/[^0-9]/g, ''), 10) : 0)}
                            value={settings?.startingScore?.toString()}
                            autoCorrect={false}
                            returnKeyType="done"
                            keyboardType='number-pad'/>
                    </View>
                    <View style={sharedStyles.spacedRowNoBorder}>
                        <BodyText>Default Score Step</BodyText>
                        <TextInput
                            placeholder='1'
                            onChangeText={(n) => setSetting('defaultScoreStep', n ? parseInt(n.replace(/[^0-9]/g, ''), 10) : 0)}
                            returnKeyType="done"
                            value={settings?.defaultScoreStep?.toString()}
                            autoCorrect={false}
                            keyboardType='number-pad'/>
                    </View>
                    <View style={sharedStyles.spacedRowNoBorder}>
                        <BodyText>High Score Wins</BodyText>
                        <Switch
                            trackColor={{ false: colors.greyMid, true: colors.primaryLight }}
                            thumbColor={settings?.highScoreWins ? colors.primaryLight : colors.greyLight}
                            ios_backgroundColor={colors.greyMid}
                            onValueChange={(n: boolean) => setSetting('highScoreWins', n)}
                            value={settings?.highScoreWins}
                        />
                    </View>
                    {/* <View style={sharedStyles.rowNoBorder}>
                        <BodyText>Score Increases By Default</BodyText>
                        <Switch
                            trackColor={{ false: colors.greyMid, true: colors.primaryLight }}
                            thumbColor={settings?.scoreIncreases ? colors.primaryLight : colors.greyLight}
                            ios_backgroundColor={colors.greyMid}
                            onValueChange={(n: boolean) => setSetting('scoreIncreases', n)}
                            value={settings?.scoreIncreases}
                        />
                    </View> */}
                </SettingsSection>
            </ScrollView>
            <UnderConstruction/>
        </SafeAreaView>
    );
}

export const RouteName = 'GameSettings';
export default observer(GameSettings);

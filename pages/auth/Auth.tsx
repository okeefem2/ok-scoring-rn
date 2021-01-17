import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { StyleSheet, Image, TextInput, View, Switch, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BodyText from '../../components/BodyText';
import CenterContent from '../../components/CenterContent';
import IconButton from '../../components/IconButton';
import NavBar from '../../components/NavBar';
import { PageNavigationProps } from '../../navigation';
import { colors } from '../../styles/colors';
import { sharedStyles } from '../../styles/shared';

const Auth = ({ navigation }: PageNavigationProps<typeof RouteName>) => {

    // TODO move all to mobx store
    // TODO if user is signed in, show a page with a drawer nav likely... this will have stuff for them to do
    // Also if not logged in show information on what an account will do for them... and probably the purchase info of some kind
    const [passVisible, setPassVisible] = useState(false);
    const [confirmPassVisible, setConfirmPassVisible] = useState(false);
    const [signIn, setSignIn] = useState(true);
    const [syncData, setSyncData] = useState(true);
    return (
        <SafeAreaView style={sharedStyles.pageContainer}>
            <NavBar
                leftButton={{ icon: 'chevron-left', title: 'Back', clickHandler: navigation.goBack }}
            />
            <CenterContent>
                <Image
                    source={require('../../assets/icon.png')}
                    style={sharedStyles.logoImage}
                    resizeMode='contain'
                />
            </CenterContent>
            <View style={sharedStyles.spacedRowNoBorder}>
                <TextInput style={[sharedStyles.bodyText, sharedStyles.input]}
                        placeholder='Email'
                        returnKeyType='next'
                        autoCorrect={false}
                        autoCompleteType={'email'}
                        keyboardType='email-address'
                        onSubmitEditing={() => {

                        }}
                        onChangeText={(email) => { }}
                        value={''}
                    />
            </View>

            <View style={sharedStyles.spacedRowNoBorder}>
                <TextInput style={[sharedStyles.bodyText, sharedStyles.input]}
                    placeholder='Password'
                    autoCompleteType='password'
                    returnKeyType='next'
                    autoCorrect={false}
                    secureTextEntry={!passVisible}
                    onSubmitEditing={() => {

                    }}
                    onChangeText={(pass) => { }}
                    value={''}
                />
                <IconButton icon={passVisible ? 'eye-off-outline' : 'eye-outline'} alignSelf={'center'} clickHandler={() => setPassVisible(!passVisible)} />
            </View>

            {
                !signIn &&
                <>
                    <CenterContent>
                        <View style={sharedStyles.spacedRowBordered}>
                            <TextInput style={[sharedStyles.bodyText, sharedStyles.input]}
                                placeholder='Confirm Password'
                                autoCompleteType='password'
                                returnKeyType='next'
                                autoCorrect={false}
                                secureTextEntry={!passVisible}
                                onSubmitEditing={() => {

                                }}
                                onChangeText={(confirmPass) => { }}
                                value={''}
                            />
                            <IconButton icon={confirmPassVisible ? 'eye-off-outline' : 'eye-outline'} alignSelf={'center'} clickHandler={() => setConfirmPassVisible(!confirmPassVisible)} />
                        </View>
                    </CenterContent>
                    <CenterContent>
                        <View style={sharedStyles.spacedRowBordered}>
                            <BodyText>Sync Local Data</BodyText>
                            <Switch
                                trackColor={{ false: colors.greyMid, true: colors.primaryLight }}
                                thumbColor={syncData ? colors.primaryLight : colors.greyLight}
                                ios_backgroundColor={colors.greyMid}
                                onValueChange={() => setSyncData(!syncData)}
                                value={syncData}
                            />
                        </View>
                    </CenterContent>
                </>
            }

            <CenterContent>
                <IconButton title='Sign In' alignSelf={'center'} clickHandler={() => { }} />
                <Text>|</Text>
                <IconButton title='Sign Up' alignSelf={'center'} clickHandler={() => { }} />
            </CenterContent>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
export const RouteName = 'Auth';
export default observer(Auth);

import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { StyleSheet, Image, TextInput, View, Switch, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BodyText from '../../components/BodyText';
import CenterContent from '../../components/CenterContent';
import IconButton from '../../components/IconButton';
import NavBar from '../../components/NavBar';
import { WrapperComponentProps } from '../../model/component';
import { PageNavigationProps } from '../../navigation';
import { colors } from '../../styles/colors';
import { sharedStyles } from '../../styles/shared';

type AuthForm = {
    email: string,
    password: string,
    confirmPassword: string,
    syncData: boolean,
}

const initialFormValues: AuthForm = {
    email: '',
    password: '',
    confirmPassword: '',
    syncData: false,
}

const Auth = ({ navigation }: PageNavigationProps<typeof RouteName>) => {

    // TODO move all to mobx store
    // TODO if user is signed in, show a page with a drawer nav likely... this will have stuff for them to do
    // Also if not logged in show information on what an account will do for them... and probably the purchase info of some kind
    const [passInputRef, setPassInputRef] = useState<TextInput>();
    const [confirmPassInputRef, setConfirmPassInputRef] = useState<TextInput>();
    const [formValues, setFormValues] = useState<AuthForm>(initialFormValues);
    const [passVisible, setPassVisible] = useState(false);
    const [confirmPassVisible, setConfirmPassVisible] = useState(false);
    const [signIn, setSignIn] = useState(true);
    const updateFormValue = (key: keyof AuthForm, value: string | boolean) => {
        if (value !== formValues[key]) {
            setFormValues({ ...formValues, [key]: value });
        }
    };

    // const Dismissible = ({ children }: WrapperComponentProps) =>
    //     <Pressable onPressOut={() => Keyboard.dismiss()}>{children}</Pressable>

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
            <View style={sharedStyles.spacedRowBordered}>
                <TextInput style={[sharedStyles.bodyText, sharedStyles.input]}
                    placeholder='Email'
                    returnKeyType='next'
                    autoCorrect={false}
                    autoCompleteType={'email'}
                    keyboardType='email-address'
                    clearButtonMode="while-editing"
                    blurOnSubmit={false}
                    onChangeText={email => updateFormValue('email', email)}
                    onSubmitEditing={() => passInputRef?.focus()}
                    value={formValues.email}
                />
            </View>
            <View style={sharedStyles.spacedRowBordered}>
                <TextInput style={[sharedStyles.bodyText, sharedStyles.input]}
                    placeholder='Password'
                    autoCompleteType='password'
                    returnKeyType={signIn ? 'done' : 'next'}
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    secureTextEntry={!passVisible}
                    blurOnSubmit={false}
                    onSubmitEditing={() => {
                        if (signIn) {
                            // TODO sign them in
                        } else {
                            confirmPassInputRef?.focus();
                        }
                    }}
                    onChangeText={(pass) => updateFormValue('password', pass)}
                    ref={(input: TextInput) => setPassInputRef(input)}
                    value={formValues.password}
                />
                <IconButton icon={passVisible ? 'eye-off-outline' : 'eye-outline'} clickHandler={() => setPassVisible(!passVisible)} />
            </View>

            {
                !signIn &&
                <>
                    <View style={sharedStyles.spacedRowBordered}>
                        <TextInput style={[sharedStyles.bodyText, sharedStyles.input]}
                            placeholder='Confirm Password'
                            autoCompleteType='password'
                            returnKeyType='next'
                            autoCorrect={false}
                            secureTextEntry={!confirmPassVisible}
                            clearButtonMode="while-editing"
                            blurOnSubmit={false}
                            onSubmitEditing={() => {
                                Keyboard.dismiss();
                            }}
                            onChangeText={(pass) => updateFormValue('confirmPassword', pass)}
                            ref={(input: TextInput) => setConfirmPassInputRef(input)}
                            value={formValues.confirmPassword}
                        />
                        <IconButton icon={confirmPassVisible ? 'eye-off-outline' : 'eye-outline'} clickHandler={() => setConfirmPassVisible(!confirmPassVisible)} />
                    </View>
                    <View style={sharedStyles.spacedRowBordered}>
                        <BodyText>Sync Local Data</BodyText>
                        <Switch
                            trackColor={{ false: colors.greyMid, true: colors.primaryLight }}
                            thumbColor={formValues.syncData ? colors.primaryLight : colors.greyLight}
                            ios_backgroundColor={colors.greyMid}
                            onValueChange={(syncData: boolean) => updateFormValue('syncData', syncData)}
                            value={formValues.syncData}
                        />
                    </View>
                </>
            }

            <View style={[sharedStyles.mt25, sharedStyles.spacedEvenlyNoBorder]}>
                <IconButton title='Sign In' alignSelf={'center'} clickHandler={() => setSignIn(true)} color={signIn ? colors.primary : colors.greyLight} />
                <IconButton title='Sign Up' alignSelf={'center'} clickHandler={() => setSignIn(false)} color={!signIn ? colors.primary : colors.greyLight} />
            </View>
        </SafeAreaView>
    );
}

export const RouteName = 'Auth';
export default observer(Auth);

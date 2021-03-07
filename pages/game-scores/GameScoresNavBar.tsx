import React, { useState } from 'react'
import { Modal, View } from 'react-native'
import Header from '../../components/Header';
import IconButton from '../../components/IconButton';
import NavBar from '../../components/NavBar';
import { useDiceIcon } from '../../hooks/useDiceIcon';
import { colors } from '../../styles/colors';
import { sharedStyles } from '../../styles/shared';

interface GameScoresNavbarProps {
    backHandler: () => void;
    saveHandler: ((playAgain: boolean) => void) | null;
    winningPlayerName?: string;
}

const GameScoresNavBar = ({ backHandler, saveHandler, winningPlayerName }: GameScoresNavbarProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    const diceIcon = useDiceIcon();
    const modalAction = (playAgain: boolean) => {
        if (!!saveHandler) {
            saveHandler(playAgain);
        }
        setModalVisible(false);
    }
    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={[sharedStyles.p20, { backgroundColor: colors.greyMidTrans, height: '100%' }]}>
                    <View style={[{ backgroundColor: colors.white }, sharedStyles.p20, sharedStyles.mt25]}>
                        {!!winningPlayerName ? <Header title={`Congratulations ${winningPlayerName}!`} /> : null}
                        <View style={[sharedStyles.spacedEvenlyNoBorder, sharedStyles.mt25]}>
                            <IconButton icon={'replay'} title={'Play Again'} clickHandler={() => {
                                modalAction(true);
                            }} iconSide='left' color={colors.primary} />
                            <IconButton icon={diceIcon} title={'New Game'} clickHandler={() => {
                                modalAction(false);
                            }} iconSide='right' color={colors.primary} />
                        </View>
                    </View>
                </View>
            </Modal>
            <NavBar
                leftButton={
                    { icon: 'chevron-left', title: 'Back', clickHandler: backHandler }
                }
                rightButton={!!saveHandler ? {
                    icon: 'content-save-outline', title: 'Save & Quit', clickHandler: () => {
                        setModalVisible(true);
                    }
                } : undefined}
            />
        </View>
    )
}

export default GameScoresNavBar;

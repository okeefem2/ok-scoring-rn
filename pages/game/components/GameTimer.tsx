import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { sharedStyles } from '../../../styles/shared';
import IconButton from '../../../components/IconButton';
import { useTimerDispatch, useTimerState } from '../../../providers/timer';

const GameTimer = () => {
    const timerState = useTimerState();
    const dispatchTimerEvent = useTimerDispatch();
    const onToggleTimer = () => {
        console.log('toggle timer');
        dispatchTimerEvent({ value: timerState.timerValue, on: !timerState.timerActive});
    };

    const onResetTimer = () => {
        dispatchTimerEvent({ value: 0, on: false});
    }

    return (
        <View style={styles.timerContainer}>
            <Text style={[sharedStyles.primaryText, styles.timerText]}>{timerState.timerText}</Text>
            <View>
                {
                    timerState.timerActive ?
                    <IconButton icon='pause' clickHandler={onToggleTimer} size={32}/> :
                    <IconButton icon='play-outline' clickHandler={onToggleTimer} size={32}/>
                }
                <View style={sharedStyles.mt10}>
                    <IconButton icon='restart' clickHandler={onResetTimer} size={32}/>
                </View>
            </View>
        </View>
    );
}

export default GameTimer

const styles = StyleSheet.create({
    timerContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerText: {
        marginBottom: 10
    }
})

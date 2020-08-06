import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Subject, BehaviorSubject, interval, of } from 'rxjs';
import { takeUntil, switchMap, filter, tap, scan } from 'rxjs/operators';
import { sharedStyles } from '../../styles/shared';
import IconButton from '../../components/IconButton';

function padNumber(num: number): string {
    return num.toString().padStart(2, '0');
}

function formatSeconds(totalSeconds: number): string {
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    let seconds = totalSeconds - (hours * 3600) - (minutes * 60);

    if (hours) {
        return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
    }
    return `${padNumber(minutes)}:${padNumber(seconds)}`;
}

const toggleTimer = new BehaviorSubject<boolean>(false);

const killTimer = new Subject();

const timer = toggleTimer.asObservable()
    .pipe(
        takeUntil(killTimer),
        switchMap((timerOn: boolean) => timerOn ? interval(1000) : of(undefined)),
        filter((t: number | undefined) => t !== undefined),
        scan((totalTime: number) => totalTime + 1, 0),
    );

const GameTimer = () => {
    const [timerActive, setTimerActive] = useState(false)
    const [timerData, setTimer] = useState({ timerText: '00:00', timerValue: 0})
    const onToggleTimer = () => {
        console.log('Toggle timer from', timerActive);
        toggleTimer.next(!timerActive);
        setTimerActive(!timerActive);
    };

    useEffect(() => {
        timer.subscribe((totalTime: number) => {
            setTimer({timerText: formatSeconds(totalTime), timerValue: totalTime });
        });

        return () => {
            console.log('kill timer!');
            killTimer.next();
            killTimer.complete();
            toggleTimer.complete();
        }
    }, []);
    return (
        <View style={styles.timerContainer}>
            <Text style={[sharedStyles.primaryText, styles.timerText]}>{timerData.timerText}</Text>
            <IconButton icon='clock-outline' clickHandler={onToggleTimer} size={32}/>

            {/* <Button title='Toggle timer' onPress={onToggleTimer} color='#FCA47C'/> */}
        </View>
    )
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
        marginBottom: 30
    }
})

import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Subject, BehaviorSubject, interval, of, Observable, NEVER } from 'rxjs';
import { takeUntil, switchMap, filter, tap, scan, startWith, map } from 'rxjs/operators';
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

interface TimerState {
    on: boolean;
    value: number;
}

const events = new BehaviorSubject<TimerState>({
    on: false,
    value: 0,
});

const killTimer = new Subject();

const GameTimer = () => {
    const [timerActive, setTimerActive] = useState(false);
    const [timerData, setTimer] = useState({ timerText: '00:00', timerValue: 0});
    const onToggleTimer = () => {
        console.log('Toggle timer from', timerActive);
        events.next({ value: timerData.timerValue, on: !timerActive});
        setTimerActive(!timerActive);
    };

    const onResetTimer = () => {
        setTimer({timerText: '00:00', timerValue: 0 });
        events.next({ value: 0, on: false});
        setTimerActive(false);
    }

    useEffect(() => {
        const timer = events.pipe(
            switchMap(timeState =>
                timeState.on
                ? interval(1000).pipe(
                    scan((totalTime): number => totalTime + 1, timeState.value),
                )
                : NEVER
            )
        );
        timer.pipe(takeUntil(killTimer)).subscribe((totalTime: number) => {
            console.log('timer val', totalTime);
            setTimer({timerText: formatSeconds(totalTime), timerValue: totalTime });
        });

        return () => {
            console.log('kill timer!');
            killTimer.next();
            killTimer.complete();
            events.complete();
        }
    }, []);
    return (
        <View style={styles.timerContainer}>
            <Text style={[sharedStyles.primaryText, styles.timerText]}>{timerData.timerText}</Text>
            <View>
                {
                    timerActive ?
                    <IconButton icon='pause' clickHandler={onToggleTimer} size={32}/> :
                    <IconButton icon='play-outline' clickHandler={onToggleTimer} size={32}/>
                }
                <View style={sharedStyles.mt10}>
                    <IconButton icon='restart' clickHandler={onResetTimer} size={32}/>
                </View>
            </View>

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
        marginBottom: 10
    }
})

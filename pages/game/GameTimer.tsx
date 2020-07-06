import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { Subject, BehaviorSubject, interval, EMPTY } from 'rxjs';
import { takeUntil, switchMap, filter } from 'rxjs/operators';

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

const toggleTimer = new BehaviorSubject<boolean>(true);

const killTimer = new Subject();
// const timer = inter(

const timer = toggleTimer.asObservable()
    .pipe(
        takeUntil(killTimer),
        switchMap(timerOn => timerOn ? interval(1000) : EMPTY),
        filter(t => !!t)
    );

const GameTimer = () => {
    const [timerActive, setTimerActive] = useState(true)
    const [timerData, setTimer] = useState({ timerText: '00:00', timerValue: 0})
    const onToggleTimer = () => {
        setTimerActive(!timerActive);
        toggleTimer.next(timerActive);
    }

    useEffect(() => {
        timer.subscribe(() => {
            const timerValue = timerData.timerValue + 1;
            setTimer({timerText: formatSeconds(timerValue), timerValue });
        });

        return () => {
            killTimer.next();
        }
    }, []);
    return (
        <View>
            <Text>{timerData.timerText}</Text>
            <Button title='Toggle timer' onPress={onToggleTimer} color='#FCA47C'/>
        </View>
    )
}

export default GameTimer

const styles = StyleSheet.create({})

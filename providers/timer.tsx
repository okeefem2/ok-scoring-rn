import React, { createContext } from 'react'

import { BehaviorSubject, interval, of, Observable } from 'rxjs';
import { useEffect, useState } from 'react';
import { switchMap, scan, map } from 'rxjs/operators';

export const TimerContext = createContext<TimerState | undefined>(undefined);
const TimerDispatchContext = createContext<TimerDispatch | undefined>(undefined);

interface TimerEvent {
    on: boolean;
    value: number;
}

type TimerDispatch = (event: TimerEvent) => void;

interface TimerState {
    timerText: string;
    timerValue: number;
    timerActive: boolean;
}

interface TimerProviderProps {
    children: React.ReactNode,
    initialTimerValue?: number;
}

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

const timerEvents = new BehaviorSubject<TimerEvent>({
    on: false,
    value: 0,
});


export function useTimer(initialValue = 0): [ TimerState, TimerDispatch ] {
    const [timerState, setTimer] = useState<TimerState>({ timerText: formatSeconds(initialValue), timerValue: initialValue, timerActive: false });

    useEffect(() => {
        timerEvents.next({
            on: false,
            value: initialValue,
        });
        const timer: Observable<TimerState> = timerEvents.pipe(
            switchMap(event =>
                event.on
                ? interval(1000).pipe(
                    scan((totalTime): number => totalTime + 1, event.value),
                    map((totalTime) => ({timerText: formatSeconds(totalTime), timerValue: totalTime, timerActive: true}))
                )
                : of({ timerText: formatSeconds(event.value), timerValue: event.value, timerActive: false})
            )
        );
        const sub = timer.subscribe((ts: TimerState) => {
            setTimer(ts);
        });

        return () => {
            sub.unsubscribe();
        }
    }, []);

    return [
        timerState,
        (event) => timerEvents.next(event),
    ]
}

export function useTimerState() {
    const context = React.useContext(TimerContext);
    if (context === undefined) {
        throw new Error('useTimerState must be used within a TimerProvider')
    }
    return context
}

export function useTimerDispatch() {
    const context = React.useContext(TimerDispatchContext)
    if (context === undefined) {
        throw new Error('useTimerDispatch must be used within a TimerProvider')
    }
    return context
}

export function TimerProvider({ children, initialTimerValue = 0 }: TimerProviderProps) {
    const [state, dispatch] = useTimer(initialTimerValue);
    return (
        <TimerContext.Provider value={state}>
            <TimerDispatchContext.Provider value={dispatch}>
                {children}
            </TimerDispatchContext.Provider>
        </TimerContext.Provider>
    );
}

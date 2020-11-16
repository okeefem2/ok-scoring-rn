import { useEffect, useState } from 'react';

const abbreviations = [
    {
        floor: 1e15,
        abbreviation: 'Q',
    },
    {
        floor: 1e12,
        abbreviation: 'T',
    },
    {
        floor: 1e9,
        abbreviation: 'B',
    },
    {
        floor: 1e6,
        abbreviation: 'M',
    },
    {
        floor: 1e3,
        abbreviation: 'K',
    },
];

export function abbreviate(value: number, max: number = 999): string {
    if (Math.abs(value) < max) {
        return value.toString();
    }
    let sign = '';
    if (value < 0) {
        value = Math.abs(value);
        sign = '-';
    }
    const abbreviation = abbreviations.find(({ floor }) => (value / floor) >= 1);
    if (abbreviation) {
        const shortenedValue = (value / abbreviation.floor).toFixed(2);
        const abbreviatedValue = `${shortenedValue}${abbreviation.abbreviation}`;
        return `${sign}${abbreviatedValue}`;
    }
    return `${sign}${value}`;
}

export function abbreviateNumber(value: number, max: number = 999): string {
    const [truncatedValue, setTruncatedValue] = useState<string>('');
    useEffect(() => {
        setTruncatedValue(abbreviate(value, max));
    }, [value, max]);

    return truncatedValue;
}

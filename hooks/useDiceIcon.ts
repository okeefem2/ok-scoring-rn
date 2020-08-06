import { useState, ChangeEvent, useEffect } from 'react';

/**
 * Custom hook to create a random dice icon when the component is created
 * can take in an input change event and update the form state based on the input name
 * @param initialValue
 */
export function useDiceIcon(): string {
    const [diceIcon, setDiceIcon] = useState<string>('');

    useEffect(() => {
        setDiceIcon(`dice-${Math.ceil(Math.random() * 6)}`);
    }, []);

    return diceIcon;
}

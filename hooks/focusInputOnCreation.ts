import { TextInput } from 'react-native';
import { useEffect, useState } from 'react';

/**
 * Custom hook that allows setting an input reference
 * when the reference changes, focus the input if it is defined
 */
export function focusInputOnCreation(): (i: TextInput) => void {
    const [inputRef, setInputRef] = useState<TextInput>();

    useEffect(() => {
        if (inputRef) {
            inputRef.focus();
        }
    }, [inputRef]);

    return setInputRef;
}

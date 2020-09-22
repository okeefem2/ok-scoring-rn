import { TextInput } from 'react-native';
import { useEffect, useState } from 'react';

export function focusInputOnCreation(): (i: TextInput) => void {
    const [inputRef, setInputRef] = useState<TextInput>();

    // TODO make a hook for this
    useEffect(() => {
        if (inputRef) {
            inputRef.focus();
        }
    }, [inputRef]);

    return setInputRef;
}

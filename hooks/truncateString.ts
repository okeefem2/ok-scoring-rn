import { useEffect, useState } from 'react';

export function truncateText(text: string, maxLength: number): string {
    const [truncatedText, setTruncatedText] = useState<string>('');

    useEffect(() => {
        if (text.length > maxLength) {
            setTruncatedText(`${text.slice(0, maxLength - 3)}...`)
        } else {
            setTruncatedText(text)
        }
    }, [text]);

    return truncatedText;
}

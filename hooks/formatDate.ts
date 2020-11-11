import { format } from 'date-fns';
import { useEffect, useState } from 'react';

/**
 * CUstom hook to convert a date in ms into a human readable format. If the date changes, the
 * formatted version will be recalculated
 * @param date in milliseconds to convert to a human readable format
 * @param dateFormat date format to use, optional
 */
export function formatDate(date: number, dateFormat: string = 'MM/dd/yyyy HH:mm'): string {
    const [formattedDate, setFormattedDate] = useState<string>('');

    useEffect(() => {
        if (date) {
            try {
                setFormattedDate(format(new Date(date), dateFormat));
            } catch (e) {
                console.log('Could not format date', date);
                setFormattedDate('Invalid Date');
            }
        }

    }, [date]);

    return formattedDate;
}

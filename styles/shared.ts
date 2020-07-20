import { StyleSheet, } from 'react-native';
import { colors } from './colors';

export const sharedStyles = StyleSheet.create({
    row: {
        padding: 15,
        width: '100%',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowNoBorder: {
        padding: 15,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    centeredContent: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scroll: {
        width: '100%',
    },
    primaryText: {
        color: colors.primary,
        fontFamily: 'Quicksand',
    },
    bodyText: {
        fontFamily: 'Quicksand',
    }
});

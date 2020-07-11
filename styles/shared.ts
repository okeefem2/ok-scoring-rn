import { StyleSheet, } from 'react-native';

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
    scroll: {
        width: '100%',
    },
    primaryText: {
        color: '#FCA47C',
    }
});

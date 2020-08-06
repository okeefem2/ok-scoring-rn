import { StyleSheet, } from 'react-native';
import { colors } from './colors';

export const sharedStyles = StyleSheet.create({
    row: {
        padding: 15,
        width: '100%',
        borderBottomColor: colors.greyMid,
        borderBottomWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowNoBorder: {
        paddingTop: 15,
        paddingBottom: 15,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowGroup: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    column: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
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
    },
    ml5: {
        marginLeft: 5,
    },
    mr5: {
        marginRight: 5,
    },
    mt10: {
        marginTop: 10
    },
    mt25: {
        marginTop: 25
    },
    mb25: {
        marginBottom: 25
    },
    headerText: {
        fontSize: 36,
        fontFamily: 'Quicksand'
    },
    centeredText: {
        textAlign: 'center',
    }
});

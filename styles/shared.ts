import { StyleSheet, } from 'react-native';
import { colors } from './colors';

export const sharedStyles = StyleSheet.create({
    plainRow: {
        paddingTop: 10,
        paddingBottom: 10,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    spacedRowBordered: {
        padding: 15,
        width: '100%',
        borderBottomColor: colors.greyMid,
        borderBottomWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    spacedRowNoBorder: {
        paddingTop: 15,
        paddingBottom: 15,
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    spacedEvenlyNoBorder: {
        paddingTop: 15,
        paddingBottom: 15,
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
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
    ml20: {
        marginLeft: 20,
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
    subHeaderText: {
        fontSize: 28,
        fontFamily: 'Quicksand'
    },
    centeredText: {
        textAlign: 'center',
    },
    input: {
        width: '100%'
    }
});

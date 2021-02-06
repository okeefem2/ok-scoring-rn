import { StyleSheet, } from 'react-native';
import { colors } from './colors';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
export const sharedStyles = StyleSheet.create({
    pageContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 15,
        paddingTop: 10,
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    plainRowNoPadding: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    plainRow: {
        paddingTop: 10,
        paddingBottom: 10,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    plainRowBordered: {
        paddingTop: 10,
        paddingBottom: 10,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: colors.greyMid,
        borderBottomWidth: 1,
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
    centeredColumn: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centeredContent: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
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
        fontSize: 20,
    },
    p5: {
        padding: 5,
    },
    ml5: {
        marginLeft: 5,
    },
    ml10: {
        marginLeft: 10
    },
    ml20: {
        marginLeft: 20,
    },
    mr5: {
        marginRight: 5,
    },
    mt5: {
        marginTop: 5,
    },
    mt10: {
        marginTop: 10
    },
    mt15: {
        marginTop: 15
    },
    mt25: {
        marginTop: 25
    },
    mb5: {
        marginBottom: 5,
    },
    mb10: {
        marginBottom: 10
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
    },
    logoImage: {
        width: '80%',
        height: 150
    },
    scoreTabelTopCell: {
        minWidth: 100,
        maxWidth: wp('25%'),
        padding: 5,
        marginRight: 20,
        fontFamily: 'Quicksand',
        fontSize: 18,
    },
    touchableCell: {
        backgroundColor: colors.primaryLight,
    },
    editingCell: {
        backgroundColor: colors.warning,
    }
});

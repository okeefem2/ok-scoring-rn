import { observer } from 'mobx-react'
import React, { useContext } from 'react'
import { FlatList, View, Text } from 'react-native'
import { RouteName as FavoritesRoute } from '../Favorites';
import { SafeAreaView } from 'react-native-safe-area-context';
import IconButton from '../../../components/IconButton';
import NavBar from '../../../components/NavBar';
import { Player } from '../../../model/player';
import { PageNavigationProps } from '../../../navigation';
import { playerHistoryContext } from '../../../state/players-history.store';
import { sharedStyles } from '../../../styles/shared';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Players = ({ navigation }: PageNavigationProps<typeof FavoritesRoute>) => {
    const { playersList, savePlayers } = useContext(playerHistoryContext);

    const toggleFavoriteForPlayer = (player: Player) => {
        const newPlayer = {
            ...player,
            favorite: !player.favorite,
        };
        savePlayers([
            newPlayer
        ]);
    }
    return (
        <SafeAreaView style={sharedStyles.pageContainer}>
            <NavBar
                leftButton={{ icon: 'chevron-left', title: 'Back', clickHandler: navigation.pop }}
            />
            <FlatList
                style={[sharedStyles.scroll, sharedStyles.mb25]}
                data={playersList}
                renderItem={
                    ({ item: player }) =>
                        <TouchableOpacity onPress={() => toggleFavoriteForPlayer(player)}>
                            <View style={sharedStyles.spacedRowNoBorder} key={player.key}>
                                <View style={sharedStyles.rowGroup}>
                                    <IconButton size={28} clickHandler={() => toggleFavoriteForPlayer(player)} icon={player.favorite ? 'star' : 'star-outline'} />
                                    <Text style={[sharedStyles.bodyText, sharedStyles.mr5]}>{player.name}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                }
            />
        </SafeAreaView>
    );
}

export const TabNavIcons = { active: 'account', inactive: 'account-outline' };
export default observer(Players);

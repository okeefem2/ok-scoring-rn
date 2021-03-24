import { observer } from 'mobx-react'
import React, { useContext } from 'react'
import { FlatList, View, Text, TouchableOpacity } from 'react-native'
import IconButton from '../../../components/IconButton'
import { gameHistoryContext } from '../../../state/game-history.store'
import { sharedStyles } from '../../../styles/shared'
import { SafeAreaView } from 'react-native-safe-area-context';
import { FavoritesRoute, PageNavigationProps } from '../../../navigation'
import NavBar from '../../../components/NavBar'
import { favoriteGamesContext } from '../../../state/favorite-games.store'

const Games = ({ navigation }: PageNavigationProps<typeof FavoritesRoute>) => {
    const { gamesList, favoritesSort, setFavoriteSort } = useContext(gameHistoryContext);
    const { toggleFavorite } = useContext(favoriteGamesContext);
    return (
        <SafeAreaView style={sharedStyles.pageContainer}>
            <NavBar
                leftButton={{ icon: 'chevron-left', title: 'Back', clickHandler: navigation.pop }}
                rightButton={{ icon: favoritesSort.asc ? 'sort-descending' : 'sort-ascending', title: 'Sort Favorites', clickHandler: () => setFavoriteSort({ ...favoritesSort, asc: !favoritesSort.asc }) }}
            />
            <FlatList
                style={[sharedStyles.scroll, sharedStyles.mb25]}
                data={gamesList}
                renderItem={
                    ({ item: game }) =>
                        <TouchableOpacity onPress={() => toggleFavorite(game.description, !game.favorite)}>
                            <View style={sharedStyles.spacedRowNoBorder} key={game.description}>
                                <View style={sharedStyles.rowGroup}>
                                    <IconButton size={28} clickHandler={() => toggleFavorite(game.description, !game.favorite)} icon={game.favorite ? 'star' : 'star-outline'} />
                                    <Text style={[sharedStyles.bodyText, sharedStyles.mr5]}>{game.description}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                }
            />
        </SafeAreaView>
    );
}

// TODO I think I need to update expo to get these icons
// export const TabNavIcons = { active: 'dice-multiple', inactive: 'dice-multiple-outline'};
export const TabNavIcons = { active: 'cards', inactive: 'cards-outline' };
export default observer(Games);

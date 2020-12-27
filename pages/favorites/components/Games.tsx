import { observer } from 'mobx-react'
import React, { useContext } from 'react'
import { FlatList, View, Text } from 'react-native'
import IconButton from '../../../components/IconButton'
import { gameHistoryContext } from '../../../state/game-history.store'
import { sharedStyles } from '../../../styles/shared'
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteName as FavoritesRoute } from '../Favorites'
import { PageNavigationProps } from '../../../navigation'
import NavBar from '../../../components/NavBar'

const Games = ({ navigation }: PageNavigationProps<typeof FavoritesRoute>) => {
    const { gamesList, toggleFavoriteGame } =  useContext(gameHistoryContext);

    return (
        <SafeAreaView style={sharedStyles.pageContainer}>
            <NavBar
                leftButton={{ icon: 'chevron-left', title: 'Back', clickHandler: navigation.pop}}
            />
            <FlatList
                style={[sharedStyles.scroll, sharedStyles.mb25]}
                data={gamesList}
                renderItem={
                    ({ item: game }) =>
                    <View style={sharedStyles.spacedRowNoBorder} key={game.key}>
                        <View style={sharedStyles.rowGroup}>
                            <IconButton size={28} clickHandler={() => toggleFavoriteGame(game)} icon={game.favorite ? 'star' : 'star-outline'} />
                            <Text style={[sharedStyles.bodyText, sharedStyles.mr5]}>{game.description}</Text>
                        </View>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

// TODO I think I need to update expo to get these icons
// export const TabNavIcons = { active: 'dice-multiple', inactive: 'dice-multiple-outline'};
export const TabNavIcons = { active: 'cards', inactive: 'cards-outline'};
export default observer(Games);

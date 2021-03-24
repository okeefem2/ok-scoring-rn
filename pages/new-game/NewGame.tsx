import React, { useContext } from 'react'
import { Image, Text } from 'react-native';
import NavBar from '../../components/NavBar'
import { sharedStyles } from '../../styles/shared'
import { Settings } from '../../model/settings'
import { useDiceIcon } from '../../hooks/useDiceIcon'
import { localDbContext } from '../../state/local-db.store'
import { gameContext } from '../../state/game.store'
import CenterContent from '../../components/CenterContent'
import NewGamePlayers from './components/smart/NewGamePlayers'
import NewGameDescription from './components/smart/NewGameDescription'
import { observer } from 'mobx-react'
import { FavoritesRoute, GameHistoryRoute, GameRoute, GameSettingsRoute, NewGameRoute, PageNavigationProps } from '../../navigation'
import { SafeAreaView } from 'react-native-safe-area-context';
import IconButton from '../../components/IconButton';
import { favoriteGamesContext } from '../../state/favorite-games.store';

export type SetSettingFunction = <K extends keyof Settings, T extends Settings[K]>(key: K, setting: T) => void;

const NewGame = ({ navigation }: PageNavigationProps<typeof NewGameRoute>) => {
    const { dbInitialized } = useContext(localDbContext);
    const { gameCanStart, description } = useContext(gameContext);
    const diceIcon = useDiceIcon();

    return (
        <SafeAreaView style={sharedStyles.pageContainer}>
            <NavBar
                leftButton={{ icon: 'settings', title: 'Game Settings', clickHandler: () => navigation.navigate(GameSettingsRoute) }}
                rightButton={{ disabled: !gameCanStart, icon: diceIcon, title: 'Start Game', clickHandler: () => navigation.navigate(GameRoute) }}
            />
            <CenterContent>
                <Image
                    source={require('../../assets/icon.png')}
                    style={sharedStyles.logoImage}
                    resizeMode='contain'
                />
            </CenterContent>
            <CenterContent>
                <Text style={[sharedStyles.bodyText, sharedStyles.centeredText, { fontSize: 30 }]}>
                    {description || 'New Game'}
                </Text>
            </CenterContent>
            <NewGameDescription />
            <NewGamePlayers />
            {
                dbInitialized &&
                <NavBar
                    leftButton={{ icon: 'book', title: 'Game History', clickHandler: () => navigation.navigate(GameHistoryRoute) }}
                    rightButton={{ icon: 'star', title: 'Favorites', clickHandler: () => navigation.navigate(FavoritesRoute) }}
                />
            }
        </SafeAreaView>
    );
}

export default observer(NewGame);

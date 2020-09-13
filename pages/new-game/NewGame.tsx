import React, { useContext } from 'react'
import { Image, View, Text } from 'react-native'
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
import { RouteName as GameHistoryRoute } from '../game-history/GameHistory';
import { RouteName as GameRoute } from '../game/Game';
import { RouteName as GameSettingsRoute } from '../game-settings/GameSettings';
import { PageNavigationProps } from '../../navigation'

export type SetSettingFunction = <K extends keyof Settings, T extends Settings[K]>(key: K, setting: T) => void;

const NewGame = ({ navigation }: PageNavigationProps<typeof RouteName>) => {
    console.log('New game!');
    const { dbInitialized, dbError } = useContext(localDbContext);
    const { gameCanStart, description } =  useContext(gameContext);
    const diceIcon = useDiceIcon();

    return (
        <View style={sharedStyles.pageContainer}>
            {
                dbInitialized &&
                <NavBar
                    leftButton={{ icon: 'book', title: 'Game History', clickHandler: () => navigation.navigate(GameHistoryRoute)}}
                />
            }
            <CenterContent>
                <Image
                    source={require('../../assets/icon.png')}
                    style={sharedStyles.logoImage}
                    resizeMode='contain'
                />
            </CenterContent>
            <CenterContent>
                <Text style={[sharedStyles.headerText, sharedStyles.centeredText]}>
                    {description}
                </Text>
            </CenterContent>
            <NewGameDescription/>
            <NewGamePlayers/>
            <NavBar
                leftButton={{ icon: 'settings', title: 'Game Settings', clickHandler: () => navigation.navigate(GameSettingsRoute)}}
                rightButton={{ disabled: !gameCanStart, icon: diceIcon, title: 'Start Game', clickHandler: () => navigation.navigate(GameRoute)}}
            />
        </View>
    );
}

export const RouteName = 'NewGame';
export default observer(NewGame);

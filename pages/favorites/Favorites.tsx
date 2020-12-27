import { NavigationContainer } from '@react-navigation/native';
import React from 'react'
import Players from './Players';
import Games from './components/Games';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { TabNavIcons as GamesTabNavIcons } from './components/Games';
import { TabNavIcons as PlayersTabNavIcons } from './Players';
import { PageNavigationProps } from '../../navigation';
import NavBar from '../../components/NavBar';

export type TabIcons = { active: string, inactive: string };
const favoriteTabs: { [k: string]: TabIcons } = {
    'Games': GamesTabNavIcons,
    'Players': PlayersTabNavIcons,
}
const Favorites = ({ navigation }: PageNavigationProps<typeof RouteName>) => {
    const Tab = createBottomTabNavigator();
    return (
        <>
            <NavigationContainer independent={true}>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color }) => {
                            const tabIcons = favoriteTabs[route.name];
                            const iconName = focused ? tabIcons.active : tabIcons.inactive;
                            // You can return any component that you like here!
                            return <MaterialCommunityIcons name={iconName} size={28} color={color} />;
                        },
                    })}
                    tabBarOptions={{
                        activeTintColor: colors.primary,
                        inactiveTintColor: colors.greyLight,
                    }}
                >
                    <Tab.Screen name='Players' component={Players} />
                    <Tab.Screen name='Games' component={Games} />
                </Tab.Navigator>
            </NavigationContainer>
        </>
    );
}

export const RouteName = 'Favorites';
export default Favorites;

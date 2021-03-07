import { NavigationContainer } from '@react-navigation/native';
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import Games, { TabNavIcons as GamesTabNavIcons } from './components/Games';
import Players, { TabNavIcons as PlayersTabNavIcons } from './components/Players';

export type TabIcons = { active: string, inactive: string };
const favoriteTabs: { [k: string]: TabIcons } = {
    'Games': GamesTabNavIcons,
    'Players': PlayersTabNavIcons,
}
const Favorites = () => {
    const Tab = createBottomTabNavigator();
    return (
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
                    activeTintColor: colors.white,
                    inactiveTintColor: colors.primary,
                    activeBackgroundColor: colors.primary,
                    tabStyle: {
                        paddingVertical: 5
                    }
                }}
            >
                <Tab.Screen name='Players' component={Players} />
                <Tab.Screen name='Games' component={Games} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default Favorites;

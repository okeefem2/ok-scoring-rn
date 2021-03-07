import { GameScoreProps } from './pages/game-scores/GameScores';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export const NewGameRoute = 'NewGame';
export const GameRoute = 'Game';
export const GameHistoryRoute = 'GameHistory';
export const GameScoresRoute = 'GameScore';
export const GameSettingsRoute = 'GameSettings';
export const GameScoreHistoryRoute = 'GameScoreHistory';
export const FavoritesRoute = 'Favorites';


export type RootStackParamList = {
    [NewGameRoute]: undefined,
    [GameRoute]: undefined,
    [GameScoresRoute]: GameScoreProps,
    [GameHistoryRoute]: undefined,
    [GameSettingsRoute]: undefined,
    [GameScoreHistoryRoute]: undefined,
    [FavoritesRoute]: undefined,
}

export type PageNavigationProps<TRouteName extends keyof RootStackParamList> = {
    route: RouteProp<RootStackParamList, TRouteName>,
    navigation: StackNavigationProp<RootStackParamList, TRouteName>
};

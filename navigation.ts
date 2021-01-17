import { GameScoreProps } from './pages/game-scores/GameScores';
import { RouteName as NewGameRoute } from './pages/new-game/NewGame';
import { RouteName as GameRoute } from './pages/game/Game';
import { RouteName as GameHistoryRoute } from './pages/game-history/GameHistory';
import { RouteName as GameScoresRoute } from './pages/game-scores/GameScores';
import { RouteName as GameSettingsRoute } from './pages/game-settings/GameSettings';
import { RouteName as GameScoreHistoryRoute } from './pages/game-score-history/GameScoreHistory';
import { RouteName as FavoritesRoute } from './pages/favorites/Favorites';
import { RouteName as AuthRoute } from './pages/auth/Auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
    [NewGameRoute]: undefined,
    [GameRoute]: undefined,
    [GameScoresRoute]: GameScoreProps,
    [GameHistoryRoute]: undefined,
    [GameSettingsRoute]: undefined,
    [GameScoreHistoryRoute]: undefined,
    [FavoritesRoute]: undefined,
    [AuthRoute]: undefined,
}

export type PageNavigationProps<TRouteName extends keyof RootStackParamList> = {
    route: RouteProp<RootStackParamList, TRouteName>,
    navigation: StackNavigationProp<RootStackParamList, TRouteName>
};

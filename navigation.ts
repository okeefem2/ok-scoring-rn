import { GameScoreProps } from './pages/game-scores/GameScores';
import { RouteName as NewGameRoute } from './pages/new-game/NewGame';
import { RouteName as GameRoute } from './pages/game/Game';
import { RouteName as GameHistoryRoute } from './pages/game-history/GameHistory';
import { RouteName as GameScoresRoute } from './pages/game-scores/GameScores';
import { RouteName as GameSettingsRoute } from './pages/game-settings/GameSettings';
import { RouteName as GameScoreHistoryModal } from './pages/game-score-history-modal/GameScoreHistoryModal';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
    [NewGameRoute]: undefined,
    [GameRoute]: undefined,
    [GameScoresRoute]: GameScoreProps,
    [GameHistoryRoute]: undefined,
    [GameSettingsRoute]: undefined,
    [GameScoreHistoryModal]: undefined,
}

export type PageNavigationProps<TRouteName extends keyof RootStackParamList> = {
    navigation: StackNavigationProp<RootStackParamList, TRouteName>
};

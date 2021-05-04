import { Player } from './player';
import { GameScoreHistory } from './game-score-history';
import { Settings } from './settings';

export interface GameState {
    key: string;
    description: string;
    date: number;
    duration?: number;
    winningPlayerKey?: string;
    dealingPlayerKey?: string;
    favorite?: boolean;

    // Relationships
    settings?: Settings;
    players: Player[];
    scoreHistory: GameScoreHistory;

    // In app only
    playerNamesForDisplay?: string;
}

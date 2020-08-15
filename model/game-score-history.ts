import { Player } from './player';
import { Settings } from './settings';

export interface PlayerScoreHistory {
    scores: number[];
    currentScore: number;
}

export interface GameScoreHistory {
    [TPlayerKey: string]: PlayerScoreHistory;
}

export interface GameState {
    key: string;
    date: string;
    duration?: number;
    winningPlayerKey?: string;
    players: Player[];
    settings?: Settings;
    scoreHistory: GameScoreHistory;
}

// TODO make scores into a Command pattern with a calculation engine to allow for redoing and time travel

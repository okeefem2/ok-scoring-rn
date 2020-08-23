import { Player } from './player';
import { Settings } from './settings';

export interface PlayerScoreHistory {
    key: string;
    playerKey: string;
    scores: number[];
    currentScore: number;
}

export interface GameScoreHistory {
    [TPlayerKey: string]: PlayerScoreHistory;
}

export interface GameState {
    key: string;
    description: string;
    date: string;
    duration?: number;
    winningPlayerKey?: string;
    settings?: Settings;
    players: Player[];
    scoreHistory: GameScoreHistory;
}

// TODO make scores into a Command pattern with a calculation engine to allow for redoing and time travel

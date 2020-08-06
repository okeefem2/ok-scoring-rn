export interface PlayerScoreHistory {
    scores: number[];
    currentScore: number;
}

export interface GameScoreHistory {
    [TPlayerKey: string]: PlayerScoreHistory;
}

// TODO make scores into a Command pattern with a calculation engine to allow for redoing and time travel

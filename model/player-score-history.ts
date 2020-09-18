export interface PlayerScoreHistory {
    key?: string;
    playerKey: string;
    scores: number[];
    currentScore: number;
}

export function reCalcCurrentScore(scoreHistory: PlayerScoreHistory): PlayerScoreHistory {
    scoreHistory.currentScore = scoreHistory.scores.reduce((sum, s) => sum + s, 0);
    return scoreHistory;
}

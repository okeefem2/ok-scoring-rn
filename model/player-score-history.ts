export function reCalcCurrentScore(scoreHistory: PlayerScoreHistory): PlayerScoreHistory {
    scoreHistory.currentScore = scoreHistory.scores.reduce((sum, s) => sum + s, 0);
    return scoreHistory;
}

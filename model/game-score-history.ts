import { PlayerScoreHistory } from './player-score-history';
import { Player } from './player';

export interface GameScoreHistory {
    [TPlayerKey: string]: PlayerScoreHistory;
}

function scoreBeatsWinner(winningScore: number, score: number, highScoreWins: boolean): boolean {
    return (highScoreWins && score > winningScore) || (!highScoreWins && score < winningScore)
}

export function determineWinner(gameScoreHistory: GameScoreHistory, highScoreWins = true): string {
    const winningScore = { playerKey: '', score: highScoreWins ? -Infinity : Infinity };

    Object.keys(gameScoreHistory).forEach((playerKey: string) => {
        const { currentScore, scores } = gameScoreHistory[playerKey];
        if (scores.length && scoreBeatsWinner(winningScore.score, currentScore, highScoreWins)) {
            winningScore.playerKey = playerKey;
            winningScore.score = currentScore;
        }
    });
    return winningScore.playerKey;
}

export function buildInitialHistory(players: Player[], startingScore: number): GameScoreHistory {
    return players.reduce(
        (history, player): GameScoreHistory => ({
            ...history,
            [player.key]: {
                playerKey: player.key,
                currentScore: startingScore,
                scores: [],
            } as PlayerScoreHistory
        }),
        {}
    );
}

export function buildScoreHistoryRounds(scoreHistory: GameScoreHistory): number[] {
    const numberRounds = Math.max(...Object.values(scoreHistory).map(v => v.scores.length));
    return Array.from({length: numberRounds}, (_, i) => i + 1);
}

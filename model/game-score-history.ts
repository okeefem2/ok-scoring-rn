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
        console.log(`Checking if ${playerKey} is the winner`, currentScore, scores);
        if (scores.length && scoreBeatsWinner(winningScore.score, currentScore, highScoreWins)) {
            winningScore.playerKey = playerKey;
            winningScore.score = currentScore;
        }
    });
    console.log('the winner is', winningScore.playerKey);
    return winningScore.playerKey;
}

export function buildInitialHistory(players: Player[], startingScore: number): GameScoreHistory {
    console.log('setting initial history');
    return players.reduce(
        (history, player) => ({
            ...history,
            [player.key]: {
                currentScore: startingScore,
                winning: false,
                losing: false,
                scores: [],
            }
        }),
        {}
    );
}

import { PlayerScoreHistory } from './player-score-history';
import { Player } from './player';

export interface GameScoreHistory {
    [TPlayerKey: string]: PlayerScoreHistory;
}


export function determineWinner(gameScoreHistory: GameScoreHistory, highScoreWins = true): string {
    const winningScore = { playerKey: '', score: highScoreWins ? -Infinity : Infinity };

    Object.keys(gameScoreHistory).forEach((playerKey: string) => {
        const { currentScore } = gameScoreHistory[playerKey];
        if ((highScoreWins && currentScore > winningScore.score) || (!highScoreWins && currentScore < winningScore.score)) {
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

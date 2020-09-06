import { PlayerScoreHistory } from './player-score-history';
import { Player } from './player';

export interface GameScoreHistory {
    [TPlayerKey: string]: PlayerScoreHistory;
}


export function determineWinner(gameScoreHistory: GameScoreHistory): string {
    const winningScore = { playerKey: '', score: 0 };

    Object.keys(gameScoreHistory).forEach((playerKey: string) => {
        const { currentScore } = gameScoreHistory[playerKey];
        if (currentScore > winningScore.score) {
            winningScore.playerKey = playerKey;
            winningScore.score = currentScore;
        }
    });
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

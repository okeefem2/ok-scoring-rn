import { PlayerScoreHistory } from './player-score-history';
import { Player } from './player';

export enum PlayerScoreMode {
    Editing,
    Current,
}

export interface PlayerScore {
    playerScore: PlayerScoreHistory;
    playerIndex: number;
    player: Player;
    scoreIndex: number;
    score: number;
};

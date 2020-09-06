import { PlayerScoreHistory } from './player-score-history';
import { Player } from './player';

export interface ActivePlayerScore {playerScore: PlayerScoreHistory, index: number, player: Player };

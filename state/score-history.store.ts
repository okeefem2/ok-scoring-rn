import { createContext } from 'react';
import { GameScoreHistory, buildInitialHistory, determineWinner } from '../model/game-score-history';
import { action, observable, computed, reaction } from 'mobx';
import { GameState } from '../model/game-state';
import { reCalcCurrentScore } from '../model/player-score-history';
import { ActivePlayerScore } from '../model/active-player-score';
import { Player } from '../model/player';

class ScoreHistoryStore {
    @observable
    scoreHistory: GameScoreHistory = {};

    @observable
    activePlayerScore?: ActivePlayerScore;

    constructor() {}

    // TODO might be a reaction? maybe not we'll see
    @computed
    get winningPlayerKey() {
        console.log('Calculating winning score, should only happen when scoreHistory updates');
        return determineWinner(this.scoreHistory);
    }

    @action
    startGame(gameState: GameState) {
        if (gameState && !Object.keys(gameState.scoreHistory ?? {}).length) {
            gameState.scoreHistory = buildInitialHistory(
                gameState.players ?? [],
                gameState.settings?.startingScore ?? 0
            );
            const players = gameState.players;
            this.activePlayerScore = {
                playerScore: gameState.scoreHistory[players[0].key],
                player: players[0],
                index: 0,
            }
        }
    }

    @action
    removeRound(playerKey: string, roundIndex: number) {
        if (this.scoreHistory) {
            this.scoreHistory[playerKey].scores.splice(roundIndex, 1);
            this.scoreHistory[playerKey] = reCalcCurrentScore(this.scoreHistory[playerKey]);
        }
    };

    @action
    updateRoundScore(playerKey: string, roundIndex: number, newScore: number) {
        if (this.scoreHistory) {
            this.scoreHistory[playerKey].scores.splice(roundIndex, 1, newScore);
            this.scoreHistory[playerKey] = reCalcCurrentScore(this.scoreHistory[playerKey]);
        }
    };

    @action
    endPlayerTurn(turnScore: number = 0, gamePlayers: Player[]) {
        if (this.scoreHistory && this.activePlayerScore) {
            const { playerScore, player } = this.activePlayerScore;
            playerScore.scores.push(turnScore);
            playerScore.currentScore += (turnScore);
            this.scoreHistory[player.key] = playerScore;
            this.changeActivePlayer(1, gamePlayers);
        }
    }

    @action
    changeActivePlayer(n: 1 | -1, gamePlayers: Player[]) {
        if (this.scoreHistory && this.activePlayerScore) {
            const { index } = this.activePlayerScore;
            let newIndex = index + n;
            if (newIndex >= gamePlayers.length) {
                newIndex = 0;
            } else if (newIndex < 0) {
                newIndex = gamePlayers.length - 1;
            }
            const player = gamePlayers[newIndex];
            const playerScore = this.scoreHistory[player.key];
            this.activePlayerScore = { playerScore, index: newIndex, player, };
        }
    }
}

export const scoreHistoryStore = new ScoreHistoryStore();
export const scoreHistoryContext = createContext(scoreHistoryStore);

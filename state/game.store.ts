import { createContext } from 'react';
import { action, observable, computed, reaction } from 'mobx';
import { Settings } from '../model/settings';
import { v4 as uuid } from 'react-native-uuid';
import { Player } from '../model/player';
import { swap } from '../util/array.util';
import { GameState } from '../model/game-state';
import { GameScoreHistory, determineWinner, buildInitialHistory } from '../model/game-score-history';
import { ActivePlayerScore } from '../model/active-player-score';
import { reCalcCurrentScore } from '../model/player-score-history';

class GameStore implements GameState {
    key = uuid();
    description = '';
    date = new Date().toLocaleDateString();
    duration = 0;

    // Observable props
    @observable
    winningPlayerKey?: string;
    @observable
    settings: Settings = {
        key: uuid(),
        // rounds: undefined,
        startingScore: 0,
        defaultScoreStep: 1,
        // scoreIncreases: true
    };
    @observable
    players: Player[] = [];
    @observable
    scoreHistory: GameScoreHistory = {};

    @observable
    activePlayerScore?: ActivePlayerScore;

    constructor() {
        reaction(() => this.scoreHistory, (scoreHistory) => {
            this.setWinningPlayerKey(determineWinner(scoreHistory));
        })
    }

    @computed
    get gameCanStart() {
        return !!this.players.length && !!this.description;
    }

    @computed
    get gameState(): GameState {
        return {
            key: this.key,
            description: this.description,
            scoreHistory: this.scoreHistory,
            date: this.date,
            players: this.players,
            settings: this.settings,
        }
    }

    @action
    setWinningPlayerKey = (key: string) => {
        this.winningPlayerKey = key;
    }

    @action
    initGameState = (gameState?: GameState) => {
        this.key = gameState?.key ?? uuid();
        this.description = gameState?.description ?? '';
        this.scoreHistory = gameState?.scoreHistory ?? {};
        this.date = gameState?.date ?? new Date().toLocaleDateString();
        this.players = gameState?.players ?? [];
        this.settings = gameState?.settings ?? {
            key: uuid(),
            // rounds: undefined;
            startingScore: 0,
            defaultScoreStep: 1,
            // scoreIncreases: true
        };
    }

    @action
    setGameDescription = (description: string) => {
        this.description = description;
    }

    @action
    setSetting = <K extends keyof Settings, T extends Settings[K]>(key: K, setting: T) => {
        this.settings = { ...this.settings, [key]: setting };
    }

    @action
    addPlayer = (player: Player) => {
        if (player && this.players) {
            console.log('Adding player!', player);
            this.players = [...this.players, player];
        }
    };

    @action
    deletePlayer = (playerKey: string) => {
        if (playerKey && this.gameState && this.players) {
            this.players = this.players.filter(p => p.key !== playerKey);
        }
    }

    @action
    shiftPlayer = (playerKey: string, direction: 1 | -1) => {
        if (playerKey && this.players) {
            const playerIndex = this.players.findIndex(p => p.key === playerKey);
            let newIndex = playerIndex + direction;
            if (newIndex < 0) {
                newIndex = this.players.length - 1;
            } else if (newIndex >= this.players.length) {
                newIndex = 0;
            }
            this.players = swap(this.players, playerIndex, newIndex);
        }
    }

    @action
    copyGameSetup = (players: Player[], settings: Settings, description: string) => {
        this.initGameState({
            key: uuid(),
            description,
            scoreHistory: {},
            date: '',
            players,
            settings
        });
    }

    @action
    startGame = () => {
        if (!Object.keys(this.scoreHistory ?? {}).length) {
            this.scoreHistory = buildInitialHistory(
                this.players ?? [],
                this.settings?.startingScore ?? 0
            );
            const players = this.players;
            this.activePlayerScore = {
                playerScore: this.scoreHistory[players[0].key],
                player: players[0],
                index: 0,
            }
        }
    }

    @action
    removeRound = (playerKey: string, roundIndex: number) => {
        if (this.scoreHistory) {
            this.scoreHistory[playerKey].scores.splice(roundIndex, 1);
            this.scoreHistory[playerKey] = reCalcCurrentScore(this.scoreHistory[playerKey]);
        }
    };

    @action
    updateRoundScore = (playerKey: string, roundIndex: number, newScore: number) => {
        if (this.scoreHistory) {
            this.scoreHistory[playerKey].scores.splice(roundIndex, 1, newScore);
            this.scoreHistory[playerKey] = reCalcCurrentScore(this.scoreHistory[playerKey]);
        }
    };

    @action
    endPlayerTurn = (turnScore: number = 0, gamePlayers: Player[]) => {
        if (this.scoreHistory && this.activePlayerScore) {
            const { playerScore, player } = this.activePlayerScore;
            playerScore.scores.push(turnScore);
            playerScore.currentScore += (turnScore);
            this.scoreHistory[player.key] = playerScore;
            this.changeActivePlayer(1, gamePlayers);
        }
    }

    @action
    changeActivePlayer = (n: 1 | -1, gamePlayers: Player[]) => {
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

export const gameStore = new GameStore();
export const gameContext = createContext(gameStore);

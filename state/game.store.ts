import { createContext } from 'react';
import { action, observable, computed, reaction } from 'mobx';
import { Settings } from '../model/settings';
import { v4 as uuid } from 'react-native-uuid';
import { Player } from '../model/player';
import { swap } from '../util/array.util';
import { GameState } from '../model/game-state';
import { GameScoreHistory, determineWinner, buildInitialHistory, buildScoreHistoryRounds } from '../model/game-score-history';
import { PlayerScore, PlayerScoreMode } from '../model/player-score';
import { reCalcCurrentScore } from '../model/player-score-history';

class GameStore implements GameState {
    key = uuid();
    date = new Date().toLocaleDateString();
    duration = 0;

    // Observable props
    @observable
    description = '';
    @observable
    winningPlayerKey?: string;
    @observable
    settings: Settings = {
        key: uuid(),
        // rounds: undefined,
        startingScore: 0,
        defaultScoreStep: 0,
        highScoreWins: true,
        // scoreIncreases: true
    };
    @observable
    players: Player[] = [];
    @observable
    scoreHistory: GameScoreHistory = {};

    @observable
    activePlayerScore?: PlayerScore;
    @observable
    editingPlayerScore?: PlayerScore;

    constructor() {
        reaction(() => this.activePlayerScore, () => {
            this.setWinningPlayerKey(determineWinner(this.scoreHistory, this.settings.highScoreWins));
        });
    }

    @computed
    get playerScoreMode(): PlayerScoreMode {
        return !!this.editingPlayerScore ? PlayerScoreMode.Editing : PlayerScoreMode.Current;
    }

    @computed
    get activeGamePlayerScore(): PlayerScore | undefined {
        return !!this.editingPlayerScore ? this.editingPlayerScore : this.activePlayerScore;
    }

    @computed
    get gameCanStart() {
        return this.players.length && !!this.description;
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
            winningPlayerKey: this.winningPlayerKey
        };
    }

    @computed
    get scoreHistoryRounds(): number[] {
        // TODO memo?
        return buildScoreHistoryRounds(this.scoreHistory);
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
            defaultScoreStep: 0,
            highScoreWins: true,
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
    updateRoundScore = (playerKey: string, roundIndex: number, newScore: number) => {
        if (this.scoreHistory && this.scoreHistory.hasOwnProperty(playerKey)) {
            this.scoreHistory[playerKey].scores.splice(roundIndex, 1, newScore);
            this.scoreHistory[playerKey] = reCalcCurrentScore(this.scoreHistory[playerKey]);
            this.editingPlayerScore = undefined;
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
    setActivePlayer = (player: Player) => {
        this.activePlayerScore = this.createPlayerScore(player);
    }

    @action
    editPlayerScore = (data: {
        playerKey: string;
        scoreIndex: number;
        score: number;
    }) => {
        const player = this.players.find(p => p.key === data.playerKey);
        if (player) {
            this.editingPlayerScore = this.createPlayerScore(player, data.scoreIndex);
        }
    }

    @action
    deletePlayerScore = ({playerKey, scoreIndex}: { playerKey: string, scoreIndex: number}) => {
        if (this.scoreHistory) {
            this.scoreHistory[playerKey].scores.splice(scoreIndex, 1);
            this.scoreHistory[playerKey] = reCalcCurrentScore(this.scoreHistory[playerKey]);
            if (this.activePlayerScore?.player.key === playerKey && this.activePlayerScore.scoreIndex >= scoreIndex) {
                this.activePlayerScore = { ...this.activePlayerScore, scoreIndex: this.activePlayerScore.scoreIndex - 1 }
            }
        }
    }

    @action
    startGame = () => {
        if (!Object.keys(this.scoreHistory ?? {}).length && this.players?.length) {
            this.scoreHistory = buildInitialHistory(
                this.players ?? [],
                this.settings?.startingScore ?? 0
            );
        }
        this.setActivePlayer(this.players[0]);
    }

    changeActivePlayer = (n: 1 | -1, gamePlayers: Player[]) => {
        if (this.scoreHistory && this.activePlayerScore) {
            const { playerIndex: index } = this.activePlayerScore;
            let newIndex = index + n;
            if (newIndex >= gamePlayers.length) {
                newIndex = 0;
            } else if (newIndex < 0) {
                newIndex = gamePlayers.length - 1;
            }
            const player = gamePlayers[newIndex];
            this.setActivePlayer(player);
        }
    }

    createPlayerScore = (player: Player, round?: number) => {
        if (player) {
            const playerIndex = this.players.findIndex(p => p.key === player.key);
            const playerScore = this.scoreHistory[player.key];
            const roundIndex = round !== undefined ?
                round :
                playerScore.scores.length ?? 0;
            let roundScore = this.settings.defaultScoreStep || 0;
            if (round !== undefined) {
                roundScore =  playerScore?.scores[round];
            }
            return {
                playerScore,
                player,
                playerIndex,
                scoreIndex: roundIndex,
                score: roundScore,
            };
        }
    }
}

export const gameStore = new GameStore();
export const gameContext = createContext(gameStore);

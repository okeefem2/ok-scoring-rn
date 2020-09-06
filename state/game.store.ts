import { createContext } from 'react';
import { action, observable, computed } from 'mobx';
import { Settings } from '../model/settings';
import { v4 as uuid } from 'react-native-uuid';
import { Player } from '../model/player';
import { swap } from '../util/array.util';
import { GameState } from '../model/game-state';

class GameStore {
    @observable
    gameState?: GameState;

    @computed
    get gameCanStart() {
        return !!this.gameState?.players?.length && !!this.gameState?.description;
    }

    @computed
    get gameDescription() {
        return this.gameState?.description;
    }

    @computed
    get gamePlayers(): Player[] {
        return this.gameState?.players ?? [];
    }

    @computed
    get gameSettings() {
        return this.gameState?.settings;
    }

    @computed
    get scoreHistory() {
        return this.gameState?.scoreHistory ?? {};
    }

    @action
    initNewGame() {
        this.gameState = {
            key: uuid(),
            description: '',
            scoreHistory: {},
            date: new Date().toLocaleDateString(),
            players: [],
            settings: {
                key: uuid(),
                // rounds: undefined,
                startingScore: 0,
                defaultScoreStep: 1,
                // scoreIncreases: true
            }
        }
    }

    @action
    setGameState(gs: GameState) {
        this.gameState = gs;
    }

    @action
    setGameDescription(description: string) {
        if (this.gameState) {
            this.gameState.description = description;
        }
    }

    @action
    setSetting<K extends keyof Settings, T extends Settings[K]>(key: K, setting: T) {
        if (this.gameState?.settings) {
            this.gameState.settings = { ...this.gameState.settings, [key]: setting };
        }
    }

    @action
    addPlayer(player: Player) {
        if (player && this.gameState?.players) {
            this.gameState.players = [...this.gameState.players, player];
        }
    };

    @action
    deletePlayer(playerKey: string) {
        if (playerKey && this.gameState && this.gamePlayers) {
            this.gameState.players = this.gamePlayers.filter(p => p.key !== playerKey);
        }
    }

    @action
    shiftPlayer(playerKey: string, direction: 1 | -1) {
        if (playerKey && this.gameState && this.gamePlayers) {
            const playerIndex = this.gamePlayers.findIndex(p => p.key === playerKey);
            let newIndex = playerIndex + direction;
            if (newIndex < 0) {
                newIndex = this.gamePlayers.length - 1;
            } else if (newIndex >= this.gamePlayers.length) {
                newIndex = 0;
            }
            this.gameState.players = swap(this.gamePlayers, playerIndex, newIndex);
        }
    }

    @action
    continueGame(gameState: GameState) {
        this.gameState = gameState;
    }

    @action
    copyGameSetup(players: Player[], settings: Settings, description: string) {
        this.gameState = {
            key: uuid(),
            description,
            scoreHistory: {},
            date: '',
            players,
            settings
        }
    }
}

export const gameStore = new GameStore();
export const gameContext = createContext(gameStore);

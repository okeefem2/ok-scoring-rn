import { createContext } from 'react';
import { GameState } from '../model/game-score-history';
import { observable, action, computed } from 'mobx';
import { localDbStore } from './local-db.store';
import { fetchGameStates, insertGame } from '../db/db';
import { addOrReplaceByKey } from '../util/array.util';

class GameHistoryStore {

    @observable gameHistory: GameState[] = [];

    @computed
    get previousGames() {
        return Array.from(new Set(this.gameHistory.map(g => g.description)));
    }
    constructor() {}

    async saveGameToDb(gameState: GameState) {
        try {
            await insertGame(gameState);
        } catch(e) {
            console.error('Error saving game to local db', e);
        }
    }

    @action saveGame(gameState: GameState) {
        this.gameHistory = addOrReplaceByKey(this.gameHistory, gameState);
        this.saveGameToDb(gameState);
    }

    @action async loadGames() {
        if (localDbStore.dbInitialized) {
            try {
                const games = await fetchGameStates();
                if (games?.length) {
                    this.gameHistory = games;
                }
            } catch(e) {
                console.error('Error loading games from local db', e);
            }
        }
    }
}

export const gameHistoryStore = new GameHistoryStore();
export const gameHistoryContext = createContext(gameHistoryStore);

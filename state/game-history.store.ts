import { createContext } from 'react';
import { observable, action, computed } from 'mobx';
import { localDbStore } from './local-db.store';
import { fetchGameStates, insertGame } from '../db/db';
import { addOrReplaceByKey } from '../util/array.util';
import { GameState } from '../model/game-state';

class GameHistoryStore {

    @observable gameHistory: GameState[] = [];
    @observable gameState?: GameState;

    @computed
    get previousGamesSelectable(): { key: number, label: string }[] {
        return Array.from(new Set(this.gameHistory.map(g => g.description))).map((d, i) => ({ label: d, key: i }));
    }

    async saveGameToDb(gameState: GameState) {
        try {
            await insertGame(gameState);
        } catch(e) {
            console.error('Error saving game to local db', e);
        }
    }

    @action saveGame= (gameState: GameState) => {
        this.gameHistory = addOrReplaceByKey(this.gameHistory, gameState);
        this.saveGameToDb(gameState);
    }

    @action loadGames = async () => {
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

    @action setGameState = (gameState?: GameState) => {
        this.gameState = gameState;
    }
}

export const gameHistoryStore = new GameHistoryStore();
export const gameHistoryContext = createContext(gameHistoryStore);

import { createContext } from 'react';
import { observable, action, computed } from 'mobx';
import { localDbStore } from './local-db.store';
import { fetchGameStates, insertGame } from '../db/db';
import { addOrReplaceByKey } from '../util/array.util';
import { GameState } from '../model/game-state';
import { GameScoreHistory } from '../model/game-score-history';

class GameHistoryStore {

    @observable gameHistory: GameState[] = [];
    @observable scoreHistory?: GameScoreHistory;

    @computed
    get previousGames() {
        return Array.from(new Set(this.gameHistory.map(g => g.description)));
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

    @action setScoreHistory = (scoreHistory: GameScoreHistory) => {
        this.scoreHistory = scoreHistory;
    }
}

export const gameHistoryStore = new GameHistoryStore();
export const gameHistoryContext = createContext(gameHistoryStore);

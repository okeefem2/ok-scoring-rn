import { createContext } from 'react';
import { observable, action, computed, reaction } from 'mobx';
import { localDbStore } from './local-db.store';
import { fetchGameStates, insertGame } from '../db/db';
import { addOrReplaceByKey } from '../util/array.util';
import { GameState } from '../model/game-state';
import { buildScoreHistoryRounds } from '../model/game-score-history';

export interface GameHistorySort { sortProp: keyof GameState, asc: boolean }
class GameHistoryStore {

    @observable sort: GameHistorySort = { sortProp: 'date', asc: false };
    @observable gameHistory: GameState[] = [];
    @observable gameState?: GameState;
    @observable gameHistorySorted: GameState[] = [];

    constructor() {
        reaction(() => this.sort, () => this.sortAndSetGameHistory([ ...this.gameHistory ]));
    }

    @computed
    get previousGamesSelectable(): { key: number, label: string }[] {
        return Array.from(new Set(this.gameHistory.map(g => g.description))).map((d, i) => ({ label: d, key: i }));
    }

    @computed
    get scoreHistoryRounds(): number[] {
        // TODO memo?
        return buildScoreHistoryRounds(this.gameState?.scoreHistory ?? {});
    }

    async saveGameToDb(gameState: GameState) {
        try {
            await insertGame(gameState);
        } catch(e) {
            console.error('Error saving game to local db', e);
        }
    }

    saveGame = (gameState: GameState) => {
        const gameHistory = addOrReplaceByKey(this.gameHistory, gameState);
        this.sortAndSetGameHistory(gameHistory)
        this.saveGameToDb(gameState);
    }

    @action loadGames = async () => {
        if (localDbStore.dbInitialized) {
            try {
                const games: GameState[] = await fetchGameStates();
                if (games?.length) {
                    this.sortAndSetGameHistory(games);
                }
            } catch(e) {
                console.error('Error loading games from local db', e);
            }
        }
    }

    @action setGameState = (gameState?: GameState) => {
        this.gameState = gameState;
    }

    @action setHistorySort = (sort: GameHistorySort) => {
        this.sort = sort;
    }

    @action sortAndSetGameHistory = (gameHistory: GameState[]) => {
        console.log('computing sort')
        const { asc, sortProp } = this.sort;
        this.gameHistory = gameHistory.sort((a, b) => {
            if (a.key === b.key) {
                return 0;
            }
            const aValue = a[sortProp];
            const bValue = b[sortProp];
            let sortDown; // Whether a should be set to a lower index than b
            if (!aValue || !bValue) {
                // If we are ascending, the undefined values should be pushed to the start of the array
                sortDown = asc ? !!bValue && !aValue : false;
            } else {

                // If we want ascending, the lower value should be pushed to the front of the array
                sortDown = asc ? aValue < bValue : aValue > bValue;
            }

            // if a should be sorted to a lower index than b, return -1 else 1
            return sortDown ? -1 : 1;
        });
    }
}

export const gameHistoryStore = new GameHistoryStore();
export const gameHistoryContext = createContext(gameHistoryStore);

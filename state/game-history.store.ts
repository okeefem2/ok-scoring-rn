import { createContext } from 'react';
import { observable, action, computed, reaction } from 'mobx';
import { localDbStore } from './local-db.store';
import { fetchGameStates, insertGame } from '../db/db';
import { addOrReplaceByKey, commaSeperateWithEllipsis } from '../util/array.util';
import { GameState } from '../model/game-state';
import { buildScoreHistoryRounds } from '../model/game-score-history';
import { Player } from '../model/player';

export interface GameHistorySort { sortProp: keyof GameState, asc: boolean }
class GameHistoryStore {

    @observable sort: GameHistorySort = { sortProp: 'date', asc: false };
    @observable gameHistory: GameState[] = [];
    @observable gameState?: GameState;

    constructor() {
        reaction(() => this.sort, () => this.sortAndSetGameHistory([ ...this.gameHistory ]));
    }

    @computed
    get favoriteGames(): { key: number, label: string }[] {
        return Array.from(new Set(this.gameHistory.filter(g => g.favorite).map(g => g.description))).map((d, i) => ({ label: d, key: i }));
    }

    @computed
    get gamesList(): GameState[] {
        const uniqueGames = this.gameHistory.reduce(
            (acc: { games: GameState[], descriptions: { [k: string]: number }}, game) => {
                if (!acc.descriptions[game.description]) {
                    acc.games.push(game);
                    acc.descriptions[game.description] = 1
                }
                return acc;
            }, { games: [], descriptions: {}}).games;
        uniqueGames.sort((a, b) => a.favorite ? -1 : b.favorite ? 1 : 0);
        return uniqueGames;
    }

    @computed
    get scoreHistoryRounds(): number[] {
        // TODO memo?
        return buildScoreHistoryRounds(this.gameState?.scoreHistory ?? {});
    }

    @action loadGames = async () => {
        if (localDbStore.dbInitialized) {
            try {
                const games: GameState[] = await fetchGameStates();
                if (games?.length) {
                    this.sortAndSetGameHistory(
                        games.map(g => this.hydrateGameStateForHistory(g))
                    );
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

    @action replaceGameState = (gameState: GameState) => {
        if (this.gameHistory) {
            this.gameHistory = addOrReplaceByKey(this.gameHistory, gameState);
        }
    }

    @action
    addOrReplacePlayer = (player: Player) => {
        if (player && this.gameState) {
            // TODO maybe I could use an actual game store for the game state here.... something to think about? non singleton stores
            const players = addOrReplaceByKey(this.gameState.players, player);
            this.gameState = {
                ...this.gameState,
                players,
            };
            this.replaceGameState(this.gameState)
        }
    };

    toggleFavoriteGame = async (game: GameState) => {
        game.favorite = !game.favorite;
        await this.saveGameToDb(game);
        this.replaceGameState(game);
    }

    async saveGameToDb(gameState: GameState) {
        try {
            await insertGame(gameState);
        } catch(e) {
            console.error('Error saving game to local db', e);
        }
    }

    saveGame = (gameState: GameState) => {
        gameState = this.hydrateGameStateForHistory(gameState);
        const gameHistory = addOrReplaceByKey(this.gameHistory, gameState);
        console.log('New game history!', gameHistory);
        this.sortAndSetGameHistory(gameHistory)
        this.saveGameToDb(gameState);
    }

    hydrateGameStateForHistory(gameState: GameState): GameState {
        gameState = this.sortGameStatePlayersByScore(gameState);
        gameState = this.setPlayerNamesForDisplay(gameState);
        gameState.duration = new Date().getTime() - gameState.date;
        return gameState;
    }

    sortGameStatePlayersByScore(gameState: GameState): GameState {
        gameState.players = gameState?.players?.sort((playerA, playerB) => {
            const { currentScore: scoreA } = gameState.scoreHistory[playerA.key];
            const { currentScore: scoreB } = gameState.scoreHistory[playerB.key];
            return scoreB - scoreA;
        });
        return gameState;
    }

    setPlayerNamesForDisplay(gameState: GameState): GameState {
        const playerNames = gameState.players.map(p => p.name);
        gameState.playerNamesForDisplay = commaSeperateWithEllipsis(playerNames);
        return gameState;
    }
}

export const gameHistoryStore = new GameHistoryStore();
export const gameHistoryContext = createContext(gameHistoryStore);

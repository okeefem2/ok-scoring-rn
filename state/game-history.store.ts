import { createContext } from 'react';
import { observable, action, computed, reaction } from 'mobx';
import { localDbStore } from './local-db.store';
import { fetchGameStates, insertGame } from '../db/db';
import { addOrReplaceByKey, commaSeperateWithEllipsis } from '../util/array.util';
import { GameState } from '../model/game-state';
import { buildScoreHistoryRounds } from '../model/game-score-history';
import { Player } from '../model/player';
import { sort, Sort } from './sort';
import { favoriteGamesStore } from './favorite-games.store';
import { playerHistoryStore } from './players-history.store';

class GameHistoryStore {

    @observable sort: Sort<GameState> = { sortProp: 'date', asc: false };
    @observable favoritesSort: Sort<GameState> = { sortProp: 'favorite', asc: false };
    @observable gameHistory: GameState[] = [];
    @observable gameState?: GameState;
    @observable gamesList: GameState[] = [];

    constructor() {
        reaction(() => this.sort, () => this.sortAndSetGameHistory([...this.gameHistory]));
        reaction(() => this.favoritesSort, () => this.sortAndSetFavoriteGames(
            this.setFavorites(this.gameHistory, favoriteGamesStore.favoriteGames)
        ));
        reaction(() => this.gameHistory, () => {
            this.sortAndSetFavoriteGames(
                this.setFavorites(this.gameHistory, favoriteGamesStore.favoriteGames),
            );
        });
        reaction(() => favoriteGamesStore.favoriteGames, () => this.sortAndSetFavoriteGames(
            this.setFavorites(this.gameHistory, favoriteGamesStore.favoriteGames),
        ));
        reaction(() => playerHistoryStore.favoritePlayers, (favoritePlayers) => {
            this.sortAndSetGameHistory(
                this.setPlayerFavorites(favoritePlayers)
            );
        });
    }

    @computed
    get scoreHistoryRounds(): number[] {
        // TODO memo?
        return buildScoreHistoryRounds(this.gameState?.scoreHistory ?? {});
    }

    setFavorites = (gameHistory: GameState[], favorites: { key: string, description: string }[]) => {
        return gameHistory.map(g => ({
            ...g,
            favorite: favorites.some(f => f.description === g.description)
        }));
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
            } catch (e) {
                console.error('Error loading games from local db', e);
            }
        }
    }

    @action setGameState = (gameState?: GameState) => {
        this.gameState = gameState;
    }

    @action setHistorySort = (sort: Sort<GameState>) => {
        this.sort = sort;
    }

    @action setFavoriteSort = (sort: Sort<GameState>) => {
        this.favoritesSort = sort;
    }

    @action sortAndSetFavoriteGames = (gameHistory: GameState[]) => {
        this.gamesList = sort(this.getUniqueGames(gameHistory), this.favoritesSort)
    }

    @action sortAndSetGameHistory = (gameHistory: GameState[]) => {
        this.gameHistory = sort(gameHistory, this.sort)
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

    @action
    setPlayerFavorites = (favoritePlayers: Player[]): GameState[] => {
        console.log('Setting player favorites!');
        return this.gameHistory.map(g => {
            const players = g.players.map(p => ({
                ...p,
                favorite: favoritePlayers?.some(f => f.key === p.key)
            }));
            return {
                ...g,
                players
            };
        });
    };

    async saveGameToDb(gameState: GameState) {
        try {
            await insertGame(gameState);
        } catch (e) {
            console.error('Error saving game to local db', e);
        }
    }

    saveGame = (gameState: GameState) => {
        gameState = this.hydrateGameStateForHistory(gameState);
        const gameHistory = addOrReplaceByKey(this.gameHistory, gameState);
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

    getUniqueGames(gameHistory: GameState[]): GameState[] {
        return gameHistory.reduce(
            (acc: { games: GameState[], descriptions: { [k: string]: number } }, game) => {
                if (!acc.descriptions[game.description]) {
                    acc.games.push(game);
                    acc.descriptions[game.description] = 1
                }
                return acc;
            }, { games: [], descriptions: {} }).games;
    }
}

export const gameHistoryStore = new GameHistoryStore();
export const gameHistoryContext = createContext(gameHistoryStore);

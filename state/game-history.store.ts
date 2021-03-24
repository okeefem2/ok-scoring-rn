import { createContext } from 'react';
import { observable, action, computed, reaction } from 'mobx';
import { localDbStore } from './local-db.store';
import { deleteGame, fetchGameStates, insertGame } from '../db/db';
import { addOrReplaceByKey, commaSeperateWithEllipsis, removeByKey } from '../util/array.util';
import { GameState } from '../model/game-state';
import { buildScoreHistoryRounds } from '../model/game-score-history';
import { Player } from '../model/player';
import { sort, Sort } from './sort';
import { favoriteGamesStore } from './favorite-games.store';
import { playerHistoryStore } from './players-history.store';

export interface GamesListItem {
    description: string;
    favorite: boolean;
}

class GameHistoryStore {

    @observable sort: Sort<GameState> = { sortProp: 'date', asc: false };
    @observable favoritesSort: Sort<GamesListItem> = { sortProp: 'favorite', asc: false };
    @observable gameHistory: GameState[] = [];
    @observable gameState?: GameState;
    @observable gamesList: GamesListItem[] = [];

    constructor() {
        reaction(() => this.sort, () => this.sortAndSetGameHistory([...this.gameHistory]));
        reaction(() => this.favoritesSort, () => this.sortAndSetFavoriteGames(
            this.gamesList.slice()
        ));
        reaction(() => this.gameHistory, () => {
            this.sortAndSetFavoriteGames(
                this.buildGamesList(this.gameHistory, favoriteGamesStore.favoriteGames),
            );
        });
        reaction(() => favoriteGamesStore.favoriteGames, () => this.sortAndSetFavoriteGames(
            this.buildGamesList(this.gameHistory, favoriteGamesStore.favoriteGames),
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

    buildGamesList = (gameHistory: GameState[], favorites: { key: string, description: string }[]) => {
        const uniqueNonFavoriteGames: GamesListItem[] = this.getUniqueGames(gameHistory)
            .reduce((acc: GamesListItem[], g) => {
                if (!favorites.some(f => f.description === g.description)) {
                    acc.push({ description: g.description, favorite: false });
                }
                return acc;
            }, []);
        favorites.forEach(f => uniqueNonFavoriteGames.push({ description: f.description, favorite: true }));
        return uniqueNonFavoriteGames;
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

    @action setFavoriteSort = (sort: Sort<GamesListItem>) => {
        this.favoritesSort = sort;
    }

    @action sortAndSetFavoriteGames = (gameList: GamesListItem[]) => {
        const sortedList = sort(gameList, this.favoritesSort)
        this.gamesList = sortedList;
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

    async deleteGameFromDb(gameKey: string) {
        try {
            deleteGame(gameKey);
        } catch (e) {
            console.error('Error saving game to local db', e);
        }
    }

    saveGame = (gameState: GameState) => {
        gameState = this.hydrateGameStateForHistory(gameState);
        const gameHistory = addOrReplaceByKey(this.gameHistory, gameState);
        this.sortAndSetGameHistory(gameHistory);
        this.saveGameToDb(gameState);
    }

    deleteGame = (gameKey: string) => {
        const gameHistory = removeByKey(this.gameHistory, gameKey);
        this.sortAndSetGameHistory(gameHistory);
        this.deleteGameFromDb(gameKey);
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

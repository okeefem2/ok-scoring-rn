import { createContext } from 'react';
import { observable, action, computed, reaction } from 'mobx';
import { localDbStore } from './local-db.store';
import { Player } from '../model/player';
import { fetchPlayers, insertPlayer } from '../db/db';
import { addOrReplaceByKey } from '../util/array.util';
import { sort, Sort } from './sort';

class PlayerHistoryStore {

    @observable playerHistory: Player[] = [];
    @observable favoritesSort: Sort<Player> = { sortProp: 'favorite', asc: false };
    @observable playersList: Player[] = [];

    constructor() {
        reaction(() => this.favoritesSort, () => this.sortAndSetFavoritePlayers([...this.playerHistory]));
        reaction(() => this.playerHistory, () => this.sortAndSetFavoritePlayers([...this.playerHistory]));
    }

    @computed
    get favoritePlayers(): Player[] {
        return this.playerHistory?.filter(p => p.favorite);
    }

    @action sortAndSetFavoritePlayers = (players: Player[]) => {
        this.playersList = sort(players, this.favoritesSort)
    }

    @action savePlayers = (players: Player[]) => {
        this.playerHistory = players.reduce((newPlayers: Player[], player) => {
            this.savePlayerToDb(player);
            return addOrReplaceByKey(newPlayers, player);
        }, [...this.playerHistory]);
    }

    @action setFavoriteSort = (sort: Sort<Player>) => {
        this.favoritesSort = sort;
    }

    toggleFavoriteForPlayer = (player: Player) => {
        const newPlayer = {
            ...player,
            favorite: !player.favorite,
        };
        this.savePlayers([
            newPlayer
        ]);
        return newPlayer;
    }

    @action loadPlayers = async () => {
        if (localDbStore.dbInitialized) {
            try {
                const players = await fetchPlayers();
                if (players?.length) {
                    this.playerHistory = players;
                }
            } catch (e) {
                console.error('Error loading players from local db', e);
            }
        }
    }

    async savePlayerToDb(player: Player) {
        try {
            await insertPlayer(player);
        } catch (e) {
            console.error('Error saving player to local db', e);
        }
    }

    getPlayerByName(name: string): Player | undefined {
        return this.playerHistory?.find(p => p.name === name);
    }
}

export const playerHistoryStore = new PlayerHistoryStore();
export const playerHistoryContext = createContext(playerHistoryStore);

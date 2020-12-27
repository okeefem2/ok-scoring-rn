import { createContext } from 'react';
import { observable, action, computed } from 'mobx';
import { localDbStore } from './local-db.store';
import { Player } from '../model/player';
import { fetchPlayers, insertPlayer } from '../db/db';
import { addOrReplaceByKey } from '../util/array.util';

class PlayerHistoryStore {

    @observable playerHistory: Player[] = [];

    @computed
    get favoritePlayers(): Player[] {
        return this.playerHistory?.filter(p => p.favorite);
    }

    @computed
    get playersList(): Player[] {
        return this.playerHistory.slice()?.sort((a, b) => a.favorite ? -1 : b.favorite ? 1 : 0);
    }

    @action savePlayers = (players: Player[]) => {
        this.playerHistory = players.reduce((newPlayers: Player[], player) => {
            this.savePlayerToDb(player);
            return addOrReplaceByKey(newPlayers, player);
        }, [ ...this.playerHistory]);
    }

    @action loadPlayers = async () => {
        if (localDbStore.dbInitialized) {
            try {
                const players = await fetchPlayers();
                if (players?.length) {
                    this.playerHistory = players;
                }
            } catch(e) {
                console.error('Error loading players from local db', e);
            }
        }
    }

    async savePlayerToDb(player: Player) {
        try {
            await insertPlayer(player);
        } catch(e) {
            console.error('Error saving player to local db', e);
        }
    }
}

export const playerHistoryStore = new PlayerHistoryStore();
export const playerHistoryContext = createContext(playerHistoryStore);

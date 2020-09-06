import { createContext } from 'react';
import { observable, action } from 'mobx';
import { localDbStore } from './local-db.store';
import { Player } from '../model/player';
import { fetchPlayers, insertPlayer } from '../db/db';
import { addOrReplaceByKey } from '../util/array.util';

class PlayerHistoryStore {

    @observable playerHistory: Player[] = [];

    constructor() {}

    async savePlayerToDb(player: Player) {
        try {
            await insertPlayer(player);
        } catch(e) {
            console.error('Error saving player to local db', e);
        }
    }

    @action savePlayer(player: Player) {
        this.playerHistory = addOrReplaceByKey(this.playerHistory, player);
        this.savePlayerToDb(player);
    }

    @action async loadPlayers() {
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
}

export const playerHistoryStore = new PlayerHistoryStore();
export const playerHistoryContext = createContext(playerHistoryStore);

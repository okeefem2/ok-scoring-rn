import { action, observable, reaction } from 'mobx';
import { createContext } from 'react';
import { deleteFavoriteGame, fetchFavoriteGames, insertFavoriteGame } from '../db/db';
import { localDbStore } from './local-db.store';
import { v4 as uuid } from 'react-native-uuid';

class FavoriteGamesStore {
    @observable
    favoriteGames: { key: string, description: string }[] = [];

    constructor() {
        reaction(() => this.favoriteGames, () => console.log('Fav games changed!', this.favoriteGames));

    }

    @action loadFavoriteGames = async () => {
        if (localDbStore.dbInitialized) {
            try {
                const favGames = await fetchFavoriteGames();
                console.log('favGames!', favGames);
                this.favoriteGames = favGames;
            } catch (e) {
                console.error('Error loading favorite games from local db', e);
            }
        }
    }

    @action
    toggleFavorite = async (description: string, favorite: boolean) => {
        console.log('toggle favorite', description, favorite);
        try {
            if (favorite) {
                const favoriteGame = { key: uuid(), description };
                console.log(favoriteGame);
                // await insertFavoriteGame(favoriteGame);
                console.log(favoriteGame);
                console.log(this.favoriteGames);
                this.favoriteGames = [...this.favoriteGames, favoriteGame];
            } else {
                // await deleteFavoriteGame(description);
                this.favoriteGames = this.favoriteGames.filter(g => g.description === description);
            }
            return true;
        } catch (e) {
            console.error('Error saving favorite game!', e);
            return false;
        }
    }
}

export const favoriteGamesStore = new FavoriteGamesStore();
export const favoriteGamesContext = createContext(favoriteGamesStore);

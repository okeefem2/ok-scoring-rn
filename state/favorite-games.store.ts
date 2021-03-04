import { action, observable } from 'mobx';
import { createContext } from 'react';
import { deleteFavoriteGame, fetchFavoriteGames, insertFavoriteGame } from '../db/db';
import { localDbStore } from './local-db.store';
import { v4 as uuid } from 'react-native-uuid';
class FavoriteGamesStore {
    @observable
    favoriteGames: { key: string, description: string }[] = [];

    @action loadFavoriteGames = async () => {
        if (localDbStore.dbInitialized) {
            try {
                this.favoriteGames = await fetchFavoriteGames();
            } catch (e) {
                console.error('Error loading favorite games from local db', e);
            }
        }
    }

    @action
    toggleFavorite = async (description: string, favorite: boolean) => {
        try {
            if (favorite) {
                const favoriteGame = { key: uuid(), description };
                await insertFavoriteGame(favoriteGame);
                this.favoriteGames = [...this.favoriteGames, favoriteGame];
            } else {
                await deleteFavoriteGame(description);
                this.favoriteGames = this.favoriteGames.filter(g => g.description !== description);
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

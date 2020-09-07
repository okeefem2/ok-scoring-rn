import { createContext } from 'react';
import { initSQLLiteDb } from '../db/db';
import { observable, action } from 'mobx';

class LocalDbStore {
    @observable dbInitialized = false;
    @observable dbError = false;

    @action setDbInitialized = (initialized: boolean) => {
        this.dbInitialized = initialized;
    }

    initLocalDb = async () => {
        try {
            await initSQLLiteDb();
            console.log('db initialized!')
            this.setDbInitialized(true);
        } catch (e) {
            this.dbInitialized = true;
            this.setDbInitialized(true);
            console.error(e);
        }
    }
}

export const localDbStore = new LocalDbStore();
export const localDbContext = createContext(localDbStore);

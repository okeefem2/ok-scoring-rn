import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('ok-scores.db');

export const initLocalDb = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {

            const foreignKeysOn = `PRAGMA foreign_keys = ON;`;
            const playerTable = `
            CREATE TABLE IF NOT EXISTS player
                (
                    key TEXT PRIMARY KEY NOT NULL,
                    name TEXT NOT NULL
                );`;
            const gameTable = `
            CREATE TABLE IF NOT EXISTS game
                (
                    key TEXT PRIMARY KEY NOT NULL,
                    winningPlayerKey TEXT
                    date TEXT
                    duration INTEGER

                    FOREIGN KEY (winningPlayerKey)
                        REFERENCES player (key)
                );`;
            const gameSettingsTable = `
            CREATE TABLE IF NOT EXISTS gameSettings
                (
                    key TEXT PRIMARY KEY NOT NULL,
                    gameKey TEXT
                    startingScore INTEGER
                    defaultScoreStep INTEGER

                    FOREIGN KEY (gameKey)
                        REFERENCES game (key)
                );`;
            const playerScoreTable = `
            CREATE TABLE IF NOT EXISTS playercore
                (
                    key TEXT PRIMARY KEY NOT NULL,
                    playerKey TEXT NOT NULL,
                    score INTEGER NOT NULL,
                    gameKey TEXT NOT NULL

                    FOREIGN KEY (playerKey)
                        REFERENCES player (key)

                    FOREIGN KEY (gameKey)
                        REFERENCES game (key)
                );`;
            tx.executeSql(
                `
                    ${foreignKeysOn}
                    ${playerTable}
                    ${gameTable}
                    ${gameSettingsTable}
                `,
                [],
                () => {
                    resolve();
                },
                (_, err): boolean => {
                    reject(err);
                    return false;
                },
            );
        });
    });
}

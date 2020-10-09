import * as SQLite from 'expo-sqlite';
import { Player } from '../model/player';
import { GameState, PlayerScoreHistory, GameScoreHistory } from '../model/game-score-history';
import { Settings } from '../model/settings';
import { SQLResultSet } from 'expo-sqlite';
import { v4 as uuid } from 'react-native-uuid';

const db = SQLite.openDatabase('ok-scores.db');

type SQLInsertData = [string, any[]];

export const initSQLLiteDb = () => {
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
                    description TEXT,
                    winningPlayerKey TEXT,
                    date TEXT,
                    duration INTEGER,

                    FOREIGN KEY (winningPlayerKey)
                        REFERENCES player (key)
                );`;
            const gameSettingsTable = `
            CREATE TABLE IF NOT EXISTS gameSettings
                (
                    key TEXT PRIMARY KEY NOT NULL,
                    gameKey TEXT,
                    startingScore INTEGER,
                    defaultScoreStep INTEGER,

                    FOREIGN KEY (gameKey)
                        REFERENCES game (key)
                );`;
            const playerScoreHistoryTable = `
            CREATE TABLE IF NOT EXISTS playerScoreHistory
                (
                    key TEXT PRIMARY KEY NOT NULL,
                    playerKey TEXT NOT NULL,
                    scores TEXT NOT NULL,
                    currentScore INTEGER NOT NULL,
                    gameKey TEXT NOT NULL,

                    FOREIGN KEY (playerKey)
                        REFERENCES player (key),

                    FOREIGN KEY (gameKey)
                        REFERENCES game (key)
                );`;
            tx.executeSql(foreignKeysOn);
            tx.executeSql(playerTable);
            tx.executeSql(gameTable);
            tx.executeSql(gameSettingsTable);
            tx.executeSql(playerScoreHistoryTable);
        }, (err) => {
            reject(err);
        }, () => {
            resolve();
        });
    });
}

export const insertPlayer = (player: Player) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            const playerInsert = `
                INSERT OR REPLACE INTO player
                    (
                        key, name
                    )
                VALUES
                    (
                        ?, ?
                    )
            `;

            tx.executeSql(
                `
                    ${playerInsert}
                `,
                [player.key, player.name],
                (_, result) => {
                    resolve(result);
                },
                (_, err): boolean => {
                    reject(err);
                    return false;
                },
            );
        });
    });
}

export const buildGameSettingsInsert = (settings: Settings): SQLInsertData => {
    return [
        `
                INSERT OR REPLACE INTO gameSettings
                    (
                        key, startingScore, defaultScoreStep, gameKey
                    )
                VALUES
                    (
                        ?, ?, ?, ?
                    )
            `, [settings.key, settings.startingScore, settings.defaultScoreStep, settings.gameKey]
    ];
}

export const buildPlayerScoresInserts = (gameKey: string, scoreHistory: GameScoreHistory): SQLInsertData[] => {
    return Object.keys(scoreHistory).map((playerKey: string) => {
        return buildPlayerScoreInsert(playerKey, gameKey, scoreHistory[playerKey]);
    });
}

export const buildPlayerScoreInsert = (playerKey: string, gameKey: string, scoreHistory: PlayerScoreHistory): SQLInsertData => {
    return [`
        INSERT OR REPLACE INTO playerScoreHistory
            (
                key, playerKey, gameKey, scores, currentScore
            )
        VALUES
            (
                ?, ?, ?, ?, ?
            )
    `, [ uuid(), playerKey, gameKey, JSON.stringify(scoreHistory.scores), scoreHistory.currentScore]];
}

export const insertGame = (gameState: GameState) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            const gameInsert = `
                INSERT OR REPLACE INTO game
                    (
                        key, date, duration, winningPlayerKey, description
                    )
                VALUES
                    (
                        ?, ?, ?, ?, ?
                    )
            `;

            tx.executeSql(
                gameInsert,
                [gameState.key, gameState.date, gameState.duration, gameState.winningPlayerKey, gameState.description]
            );
            buildPlayerScoresInserts(gameState.key, gameState.scoreHistory).forEach(
                (insertData: SQLInsertData) => tx.executeSql(...insertData)
            );
            if (gameState.settings) {
                tx.executeSql(
                    ...buildGameSettingsInsert(gameState.settings)
                );
            }
        },
        (err): boolean => {
            reject(err);
            return false;
        },
        () => {
            resolve();
        });
    });
}

const unwrapResult = (resultSet: SQLResultSet): any[] => {
    const results = [];
    for (let i = 0; i < resultSet.rows.length; i ++) {
        results.push(resultSet.rows.item(i));
    }
    return results;
}

export const fetchPlayers = (playerKeys?: string[]): Promise<Player[]> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            const playerKeysClause = playerKeys ?
                ` WHERE p.key in (${playerKeys.map(k => `"${k}"`).join(',')})` :
                '';
            const playersSelect = `
                SELECT * FROM player p${playerKeysClause};
            `;

            tx.executeSql(playersSelect,
                [],
                (_, result) => {
                    resolve(unwrapResult(result));
                },
                (_, err): boolean => {
                    reject(err);
                    return false;
                },
            );
        });
    });
};

export const fetchGameStates = async (): Promise<GameState[]> => {
    const gameStates: GameState[] = await fetchGames();
    for (let gameState of gameStates) {
        const playerScores = await fetchPlayerScores(gameState.key);
        const players = await fetchPlayers(playerScores.map(p => p.playerKey));
        gameState.scoreHistory = playerScores.reduce(
            (history, playerScore) => ({
                ...history,
                [playerScore.playerKey]: {
                    ...playerScore,
                    scores: JSON.parse(playerScore.scores as any)
                }
            }),
            {}
        );
        gameState.players = players;
        gameState.settings = await fetchGameSettings(gameState.key);
    }

    return gameStates;
};

export const fetchGames = (): Promise<GameState[]> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            const gameSelect = `
                SELECT * FROM game g;
            `;

            tx.executeSql(
                gameSelect,
                [],
                (_, result) => {
                    resolve(unwrapResult(result));
                },
                (_, err): boolean => {
                    reject(err);
                    return false;
                },
            );
        });
    });
};

export const fetchGameSettings = (gameKey: string): Promise<Settings> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            const gameSettingsSelect = `
                SELECT * FROM gameSettings gs WHERE gs.gameKey = "${gameKey}";
            `;

            tx.executeSql(
                gameSettingsSelect,
                [],
                (_, result) => {
                    const settings = unwrapResult(result)[0];
                    resolve(settings);
                },
                (_, err): boolean => {
                    reject(err);
                    return false;
                },
            );
        });
    });
};

export const fetchPlayerScores = (gameKey: string): Promise<PlayerScoreHistory[]> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            const playerScoresSelect = `
                SELECT * FROM playerScoreHistory psh WHERE psh.gameKey = "${gameKey}";
            `;

            tx.executeSql(
                playerScoresSelect,
                [],
                (_, result) => {
                    resolve(unwrapResult(result));
                },
                (_, err): boolean => {
                    reject(err);
                    return false;
                },
            );
        });
    });
};

import * as SQLite from 'expo-sqlite';
import { Player } from '../model/player';
import { Settings } from '../model/settings';
import { SQLResultSet } from 'expo-sqlite';
import { PlayerScoreHistory } from '../model/player-score-history';
import { GameState } from '../model/game-state';
import { buildPlayerScoresInserts, buildGameSettingsInsert } from './insertBuilders';
import { migrations } from './migrations/migrations';

const db = SQLite.openDatabase('ok-scores.db');

export const initSQLLiteDb = () => {
    console.log('Init db!');
    return runMigrations();
}

type TxHandler<T> = (tx: SQLite.SQLTransaction, resolve: (value: T) => void, reject: (reason?: any) => void) => void
// TODO needs some work
function transaction<T = any>(...txHandlers: TxHandler<T>[]): Promise<T> {
    return new Promise<T>((resolve: (value: T) => void, reject) => {
        db.transaction(
            tx => txHandlers?.filter(t => !!t)?.forEach(txHandler => txHandler(tx, resolve, reject)),
            (err) => {
                reject(err);
            }
        );
    });
}

const unwrapResult = (resultSet: SQLResultSet): any[] => {
    const results = [];
    for (let i = 0; i < resultSet.rows.length; i++) {
        results.push(resultSet.rows.item(i));
    }
    return results;
}

const select = <T>(sql: string, args: any[] = []) => {
    return (tx: SQLite.SQLTransaction, resolve: (value: T[]) => void, reject: (reason?: any) => void) => {
        tx.executeSql(
            sql,
            args,
            (_, result) => {
                resolve(unwrapResult(result));
            },
            (_, err): boolean => {
                reject(err);
                return false;
            },
        );
    }
}

const selectOne = <T>(sql: string, args: any[] = []) => {
    return (tx: SQLite.SQLTransaction, resolve: (value: T) => void, reject: (reason?: any) => void) => {
        tx.executeSql(
            sql,
            args,
            (_, result) => {
                const results = unwrapResult(result);
                resolve(!!results ? results[0] : null);
            },
            (_, err): boolean => {
                reject(err);
                return false;
            },
        );
    }
}

const insert = (sql: string, args: any[] = []) => {
    return (tx: SQLite.SQLTransaction, resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
        tx.executeSql(
            sql,
            args,
            (_, result) => {
                resolve(result);
            },
            (_, err): boolean => {
                reject(err);
                return false;
            },
        );
    }
}

const execute = (sql: string, args: any[] = []) => {
    return (tx: SQLite.SQLTransaction, resolve: (value: boolean) => void, reject: (reason?: any) => void) => {
        tx.executeSql(
            sql,
            args,
            () => {
                resolve(true);
            },
            (_, err): boolean => {
                reject(err);
                return false;
            },
        );
    }
}

const getPragmaUser = (): Promise<{ user_version: number }> => {
    return transaction(
        selectOne(`PRAGMA user_version;`)
    );
}

const runMigrations = async () => {
    const { user_version: pragmaUser } = await getPragmaUser();
    console.log('pragma user', pragmaUser);
    const newMigrations = migrations?.filter(m => m.version > pragmaUser) ?? [];
    const statements: TxHandler<boolean>[] = newMigrations?.flatMap(m => m.statements)
        .map(s => execute(s));

    const maxPragma = Math.max(...newMigrations.map(m => m.version), pragmaUser, 0);

    console.log('max pragma', maxPragma);

    return transaction(
        execute(`PRAGMA foreign_keys = ON;`),
        ...statements,
        execute(`PRAGMA user_version = ?;`, [maxPragma]),
    );
};

// Deletes

export const deleteFavoriteGame = (description: string) => {
    const favoriteGameDelete = `
        DELETE FROM favoriteGame WHERE description = ?
    `;
    return transaction(execute(favoriteGameDelete, [description]));
}

export const deleteGame = (gameKey: string) => {

    const playerScoreHistoryDelete = `
                DELETE from playerScoreHistory where gameKey = ?;
            `;

    const gameSettingsDelete = `
                DELETE from gameSettings where gameKey = ?;
            `;

    const gameDelete = `
                DELETE from game where key = ?;
            `;
    return transaction(
        execute(playerScoreHistoryDelete, [gameKey]),
        execute(gameSettingsDelete, [gameKey]),
        execute(gameDelete, [gameKey]),
    );
}

// Inserts

export const insertFavoriteGame = ({ key, description }: { key: string, description: string }) => {
    const favoriteGameInsert = `
                INSERT OR REPLACE INTO favoriteGame
                    (
                        key, description
                    )
                VALUES
                    (
                        ?, ?
                    )
            `;
    return transaction(
        insert(favoriteGameInsert, [key, description])
    );
}

export const insertPlayer = (player: Player) => {
    const playerInsert = `
                INSERT OR REPLACE INTO player
                    (
                        key, name, favorite
                    )
                VALUES
                    (
                        ?, ?, ?
                    )
            `;

    return transaction(
        insert(playerInsert, [player.key, player.name, player.favorite])
    );
}

export const insertGame = async (gameState: GameState) => {
    const gameInsert = `
                INSERT OR REPLACE INTO game
                    (
                        key, date, duration, winningPlayerKey, description, dealingPlayerKey
                    )
                VALUES
                    (
                        ?, ?, ?, ?, ?, ?
                    );
            `;
    transaction(
        insert(gameInsert, [gameState.key, gameState.date, gameState.duration, gameState.winningPlayerKey, gameState.description, gameState.dealingPlayerKey]),
        ...buildPlayerScoresInserts(gameState.key, gameState.scoreHistory).map(insertData => insert(...insertData)),
        gameState.settings ? insert(...buildGameSettingsInsert(gameState.settings)) : () => { }
    );
}

// Selects

export const fetchPlayers = (playerKeys?: string[]): Promise<Player[]> => {
    const playerKeysClause = playerKeys ?
        ` WHERE p.key in (${playerKeys.map(k => `"${k}"`).join(',')})` :
        '';
    const playersSelect = `
                SELECT * FROM player p${playerKeysClause};
            `;
    return transaction(
        select(playersSelect)
    );
}

export const fetchGameStates = async (): Promise<GameState[]> => {
    const gameStates: GameState[] = await fetchGames();
    for (let gameState of gameStates) {
        const playerScores = await fetchPlayerScores(gameState.key);
        const players = await fetchPlayers(playerScores.map(p => p.playerKey));
        gameState.date = parseInt(gameState.date.toString(), 10);
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

    console.log('games', gameStates);

    return gameStates;
}

export const fetchGames = (): Promise<GameState[]> => {
    const gameSelect = `
        SELECT * FROM game g;
    `;

    return transaction(
        select(gameSelect)
    );
}

export const fetchGameSettings = (gameKey: string): Promise<Settings> => {
    // TODO parameterize
    const gameSettingsSelect = `
        SELECT * FROM gameSettings gs WHERE gs.gameKey = "${gameKey}";
    `;

    return transaction(selectOne(gameSettingsSelect));
}

export const fetchFavoriteGames = (): Promise<{ key: string, description: string }[]> => {

    const favoriteGamesSelect = `
        SELECT * FROM favoriteGame fg;
    `;

    return transaction(select(favoriteGamesSelect));
}


export const fetchPlayerScores = (gameKey: string): Promise<PlayerScoreHistory[]> => {
    // TODO parameterize
    const playerScoresSelect = `
        SELECT * FROM playerScoreHistory psh WHERE psh.gameKey = "${gameKey}";
    `;
    return transaction(select(playerScoresSelect));
}

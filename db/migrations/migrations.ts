export interface Migration {
    version: number;
    statements: string[];
}

export const migrations: Migration[] = [
    {
        version: 1,
        statements: [
            `
            CREATE TABLE IF NOT EXISTS player
                (
                    key TEXT PRIMARY KEY NOT NULL,
                    name TEXT NOT NULL,
                    favorite INTEGER
                );
            `,

            `
            CREATE TABLE IF NOT EXISTS game
                (
                    key TEXT PRIMARY KEY NOT NULL,
                    description TEXT,
                    winningPlayerKey TEXT,
                    dealingPlayerKey TEXT,
                    date INTEGER,
                    duration INTEGER,

                    FOREIGN KEY (winningPlayerKey)
                        REFERENCES player (key)
                    FOREIGN KEY (dealingPlayerKey)
                        REFERENCES player (key)
                );
            `,

            `
            CREATE TABLE IF NOT EXISTS gameSettings
                (
                    key TEXT PRIMARY KEY NOT NULL,
                    gameKey TEXT,
                    startingScore INTEGER,
                    defaultScoreStep INTEGER,
                    dealerSettings TEXT,

                    FOREIGN KEY (gameKey)
                        REFERENCES game (key)
                );
            `,

            `
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
                );
            `,

            `
            CREATE TABLE IF NOT EXISTS favoriteGame
                (
                    key TEXT PRIMARY KEY NOT NULL,
                    description TEXT NOT NULL UNIQUE
                );
            `,
        ],
    },
    {
        version: 2,
        statements: [
            `ALTER TABLE gameSettings ADD COLUMN dealerSettings TEXT DEFAULT NULL;`,
            `ALTER TABLE game ADD COLUMN dealingPlayerKey TEXT DEFAULT NULL;`,
            `
                CREATE TABLE IF NOT EXISTS game_temp
                        (
                            key TEXT PRIMARY KEY NOT NULL,
                            description TEXT,
                            winningPlayerKey TEXT,
                            dealingPlayerKey TEXT,
                            date INTEGER,
                            duration INTEGER,

                            FOREIGN KEY (winningPlayerKey)
                                REFERENCES player (key)
                            FOREIGN KEY (dealingPlayerKey)
                                REFERENCES player (key)
                        );
            `,
            `INSERT INTO game_temp SELECT * FROM game;`,
            `DROP TABLE GAME;`,
            `ALTER TABLE game_temp RENAME TO game;`,
        ],
    },
];

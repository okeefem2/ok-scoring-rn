import { GameScoreHistory } from '../model/game-score-history';
import { PlayerScoreHistory } from '../model/player-score-history';
import { Settings } from '../model/settings';
import { v4 as uuid } from 'react-native-uuid';

export type SQLInsertData = [string, any[]];

export const buildGameSettingsInsert = (settings: Settings): SQLInsertData => {
    return [
        `
                INSERT OR REPLACE INTO gameSettings
                    (
                        key, startingScore, defaultScoreStep, gameKey, dealerSettings
                    )
                VALUES
                    (
                        ?, ?, ?, ?, ?
                    )
            `, [settings.key, settings.startingScore, settings.defaultScoreStep, settings.gameKey, settings.dealerSettings]
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
    `, [uuid(), playerKey, gameKey, JSON.stringify(scoreHistory.scores), scoreHistory.currentScore]];
}

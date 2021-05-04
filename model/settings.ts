export enum DealerSettings {
    Constant = 'constant',
    NewPerRound = 'newPerRound',
    Manual = 'manual',
}

export const DealerSettingsText = {
    'constant': 'Same Dealer Per Round',
    'newPerRound': 'New Dealer Per Round',
    'manual': 'Set Dealer Manually',
}
export interface Settings {
    key: string;
    gameKey?: string;
    // rounds?: number;
    // roundTimeLimit?: number;
    startingScore?: number;
    defaultScoreStep?: number;
    highScoreWins: boolean
    dealerSettings?: DealerSettings;
    // scoreIncreases?: boolean;
    // par?: number;
}

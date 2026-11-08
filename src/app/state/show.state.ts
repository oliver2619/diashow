export enum ShowMode {
    SORT_BY_FILENAME, SORT_BY_LAST_MODIFIED, RANDOM,
}

export interface ShowState {
    readonly folder: string;
    readonly mode: ShowMode;
    readonly duration: number;
}
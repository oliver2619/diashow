import { createActionGroup, props } from "@ngrx/store";
import { ShowMode } from "../state/show.state";

export interface ShowSetAction {
    readonly folder: string;
    readonly mode: ShowMode;
    readonly duration: number;
}

export const showActions = createActionGroup({
    source: 'Show',
    events: {
        set: props<ShowSetAction>(),
    },
});
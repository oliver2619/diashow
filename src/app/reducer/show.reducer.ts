import { createReducer, on } from "@ngrx/store";
import { ShowMode, ShowState } from "../state/show.state";
import { showActions, ShowSetAction } from "../action/show.action";

const initialState: ShowState = {
    duration: 10,
    folder: '',
    mode: ShowMode.RANDOM,
}

function onSet(_state: ShowState, action: ShowSetAction): ShowState {
    return {
        duration: action.duration,
        folder: action.folder,
        mode: action.mode,
    };
}

export const showReducer = createReducer(
    initialState,
    on(showActions.set, onSet),
);
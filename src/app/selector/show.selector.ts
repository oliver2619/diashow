import { createFeatureSelector } from "@ngrx/store";
import { ShowState } from "../state/show.state";

export const showSelector = createFeatureSelector<ShowState>('show');
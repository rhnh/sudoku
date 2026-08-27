import type { State } from "./state";
import type { Value } from "./types";
export declare const addNote: (state: State) => (value: Value) => void;
export declare function renderNotes(state: State): State;

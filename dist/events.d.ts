import type { Key, State, MouchEvent } from "./types";
export declare const events: (state: State) => State;
export declare const resetDraggingElement: (state: State) => void;
export declare const addNoteOrValue: (state: State) => void;
export declare const stopDragging: (state: State) => void;
export declare const fillNewSelectedCells: (state: State) => (key: Key) => void;
export declare const pointerup: (state: State) => (e: MouchEvent) => State;

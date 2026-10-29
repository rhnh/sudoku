import { type State } from "./state";
import type { Key, MouchEvent } from "./types";
export declare const boardMouseEvent: (state: State) => State;
export declare const isReadonly: (state: State) => (key: Key) => boolean;
export declare const setHighlight: (state: State) => (key: Key) => void;
export declare const stopDragging: (state: State) => void;
export declare const selectSquare: (state: State) => (e: MouchEvent) => (key: Key) => void;

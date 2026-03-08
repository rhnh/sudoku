import type { State } from "./types";
export declare const events: (state: State) => State;
export declare const numPadEvents: (state: State) => State;
export declare function keyEvents(state: State): State;
export declare function panelEvents(state: State): State;

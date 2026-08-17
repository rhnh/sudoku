import { type CellElement, type State, type Value } from "./types";
export declare const renderNumpad: (state: State) => State;
export declare const renderAside: (state: State) => State;
export declare const render: (state: State) => State;
export declare function updateBounds(s: State): void;
export declare function renderBase(state: State): State;
export declare function renderNavPanel(state: State): State;
export declare function renderGameOver(state: State): void;
/**
 *
 * @param
 * @returns
 */
export declare function drawLine({ x1, x2, y1, y2, key, strokeWidth, className, }: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    key: string;
    strokeWidth?: number;
    className: string;
}): SVGLineElement;
export declare function drawBackground(state: State): void;
export declare function renderBoard(state: State): State;
export declare const addNote: (state: State) => (value: Value) => void;
export declare function renderNotes(state: State, el: CellElement): State;

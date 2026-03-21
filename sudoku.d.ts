import type { Cells, Digits, Key, State, Value } from "./types";
import { Box } from "./utils";
export declare function getDigits(): Digits;
export declare const initState: (el: HTMLElement, sudoku: {
    cells: Map<Key, Value>;
    solutions?: Map<Key, Value>;
}) => State;
export declare const getCells: () => {
    cells: Cells;
    solutions: Map<Key, Value>;
};
export declare function Sudoku(e: HTMLElement, sudoku: {
    cells: Cells;
    solutions: Map<Key, Value>;
}): Box<State>;

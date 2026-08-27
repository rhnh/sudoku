/**
 * This a temporary solution.  needed to rewritten.
 * @param grid
 * @param rowStart
 * @param colStart
 * @param num
 * @returns
 */
import { Cells, Key, Value } from "./types";
export declare function sudokuGenerator(k: number): {
    grid: number[][];
    solution: Map<any, any>;
};
export declare const getCells: (emptyCells: number) => {
    cells: Cells;
    solutions: Map<Key, Value>;
};

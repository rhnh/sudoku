import { type Box } from "./lib";
import type { State } from "./state";
import type { Cells, Key, Value } from "./types";
export { getCells } from "./sudoku.algo";
export declare const initState: ({ el, cells, solutions, }: {
    el: HTMLElement;
    cells: Cells;
    solutions: Cells;
}) => State;
export declare function Sudoku({ el, cells, solutions, }: {
    el: HTMLElement;
    cells: Cells;
    solutions: Map<Key, Value>;
}): Box<State>;

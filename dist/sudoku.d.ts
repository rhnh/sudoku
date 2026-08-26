import type { Cells, Key, Value } from "./types";
import "./assets/base.style.css";
import "./assets/media-queries.css";
import "./assets/btn.css";
import { State } from "./state";
import { Box } from "./lib";
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

import { events } from "./events";
import { keyEvents } from "./keyEvent";
import { Box } from "./lib";
import { render, renderBase } from "./render";
import { getButtonKeys, getDigits } from "./utils";
import "./assets/base.style.css";
import "./assets/media-queries.css";
import "./assets/btn.css";
export { getCells } from "./sudoku.algo";
export const initState = ({ el, cells, solutions, }) => {
    const userInput = new Map();
    const userInputKeys = [...solutions.keys()];
    userInputKeys.map((r) => userInput.set(r, "0"));
    const headlessState = {
        gameState: "isInitialed",
        cells: new Map(cells),
        originCell: new Map(cells),
        selected: [],
        digits: getDigits(),
        notes: new Map(),
        buttons: getButtonKeys(),
        isNote: false,
        isDragging: false,
        isHold: false,
        highlight: new Map(),
        duplicates: new Map(),
        solutions,
        userInput, //TODO: After every click it should scan if this not empty and if it filled and has the correct answers
        seconds: 0,
        lastMoves: [],
    };
    const state = {
        ...headlessState,
        wrap: el,
        rerender: render,
        addDimensionsCssVarsTo: undefined,
    };
    return state;
};
export function Sudoku({ el, cells, solutions, }) {
    return Box(initState({ el, cells, solutions }))
        .map(renderBase)
        .map(render)
        .map(events)
        .map(keyEvents);
}
//# sourceMappingURL=sudoku.js.map
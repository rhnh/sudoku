import { DIGITS, LEVELS, PLAY_MODE_BTNS } from "./constants";
import { createElement, memo } from "./lib";
export const configurePanelElements = () => {
    const panel = createElement({ tag: "section", classname: "sudoku-panel" });
    const timerElement = createElement({
        tag: "section",
        classname: "sudoku-timer",
    });
    const utilsElement = createElement({
        tag: "section",
        classname: "sudoku-utils",
    });
    const digitElement = createElement({
        tag: "section",
        classname: "sudoku-digits",
    });
    const controlsElement = createElement({
        tag: "section",
        classname: "sudoku-controls",
    });
    const customizationElement = createElement({
        tag: "section",
        classname: "sudoku-controls",
    });
    return {
        panel,
        idleModeSection: utilsElement,
        digitElement,
        playModeSection: controlsElement,
        timerElement,
        customizationElement,
    };
};
export const configureBoardElements = () => {
    const board = createElement({
        tag: "section",
        classname: "sudoku-board",
    });
    const grid = createElement({
        tag: "section",
        classname: "sudoku-grid",
    });
    const squaresElement = createElement({
        tag: "section",
        classname: "sudoku-squares",
    });
    board.append(grid, squaresElement);
    return {
        squaresElement,
        grid,
        board,
    };
};
export const configureElements = (state) => {
    const { root } = state;
    root.dataset.theme = state.currentTheme;
    const container = createElement({
        tag: "section",
        classname: "sudoku-container",
    });
    const { panel, idleModeSection: utilsElement, digitElement, playModeSection: controlsElement, timerElement, customizationElement, } = configurePanelElements();
    state = { ...state, ...configurePanelElements() };
    const { board, grid, squaresElement } = configureBoardElements();
    root.appendChild(container);
    container.append(board, panel);
    const bounds = memo(() => container.getBoundingClientRect());
    const base = {
        root,
        panel,
        idleModeSection: utilsElement,
        digitElement,
        playModeSection: controlsElement,
        timerElement,
        board,
        grid,
        squaresElement,
        container,
        bounds,
        customizationElement,
    };
    return base;
};
export const initButtons = () => {
    const controlButtons = new Set(PLAY_MODE_BTNS);
    const digits = new Set(DIGITS);
    const levelButtons = new Set(LEVELS);
    const btn = {
        digits,
        playButtons: controlButtons,
        levelButtons,
    };
    return btn;
};
//# sourceMappingURL=config.js.map
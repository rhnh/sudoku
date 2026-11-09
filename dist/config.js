import { DIGITS, LEVELS, PLAY_MODE_BTNS } from "./constants";
import { createElement, memo } from "./lib";
export const configurePanelElements = () => {
    const panel = createElement({ tag: "section", classname: "sudoku-panel" });
    const timerElement = createElement({
        tag: "section",
        classname: "sudoku-timer",
    });
    const idleModeSection = createElement({
        tag: "section",
        classname: "sudoku-idle--mode",
    });
    const digitElement = createElement({
        tag: "section",
        classname: "sudoku-digits",
    });
    const playModeSection = createElement({
        tag: "section",
        classname: "sudoku-play--mode",
    });
    const customizationElement = createElement({
        tag: "section",
        classname: "sudoku-customization",
    });
    return {
        panel,
        idleModeSection,
        digitElement,
        playModeSection,
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
    const wrapper = createElement({ tag: "section", classname: "wrapper" });
    root.dataset.theme = state.currentTheme;
    const container = createElement({
        tag: "section",
        classname: "sudoku-container",
    });
    const { panel, idleModeSection, digitElement, playModeSection, timerElement, customizationElement, } = configurePanelElements();
    state = { ...state, ...configurePanelElements() };
    const { board, grid, squaresElement } = configureBoardElements();
    wrapper.appendChild(container);
    wrapper.appendChild(panel);
    container.append(board);
    root.appendChild(wrapper);
    const bounds = memo(() => container.getBoundingClientRect());
    const base = {
        root,
        panel,
        idleModeSection,
        digitElement,
        playModeSection,
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
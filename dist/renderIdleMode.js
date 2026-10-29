import { BOARD_SIZE, IDLE_MODE_BTNS } from "./constants";
import { Box, createElement, id } from "./lib";
import { isIdle } from "./state";
export const renderIdleMode = (state) => isIdle(state.gameState)
    ? Box(state)
        .map(renderLevelButtons)
        .map(playEvent)
        .map(zenModeEvent)
        .map(themeEvent)
        .map(infoEvent)
        .fold(id)
    : state;
export const renderLevelButtons = (state) => {
    const section = state.idleModeSection;
    if (state.gameState !== "idle")
        return state;
    const width = state.bounds().width / BOARD_SIZE;
    const height = width;
    IDLE_MODE_BTNS.forEach((label) => {
        const btn = createElement({
            tag: "button",
            classname: `sudoku-btns sudoku-btns-${label} ${label}`,
        });
        const l = label.slice("sudoku-".length);
        const i = createElement({ tag: "i", classname: `icon-${l}` });
        btn.appendChild(i);
        btn.style.width = `${width}px`;
        btn.style.aspectRatio = "1/1";
        section.appendChild(btn);
    });
    for (const v of state.levelButtons) {
        const btn = createElement({
            tag: "button",
            classname: `sudoku-btns ${state.isZenMode ? "zen-mode" : "mode"}`,
        });
        btn.style.height = `${width}px`;
        btn.style.width = `${height}px`;
        btn.innerHTML = v;
        section.append(btn);
    }
    state.panel.appendChild(section);
    return state;
};
export const playEvent = (state) => {
    const selector = ".sudoku-play";
    const btn = state.panel.querySelector(selector);
    if (!btn)
        return state;
    btn.addEventListener("click", () => {
        state.gameState = "play";
        state.hardRerender(state);
    });
    return state;
};
export const zenModeEvent = (state) => {
    const selector = ".sudoku-zen";
    const zen = state.panel.querySelector(selector);
    if (zen)
        zen.addEventListener("pointerdown", () => {
            state.isZenMode = !state.isZenMode;
            state.hardRerender(state);
        });
    return state;
};
export const themeEvent = (state) => {
    const selector = ".sudoku-themes";
    const themes = state.panel.querySelector(selector);
    if (themes)
        themes.addEventListener("pointerdown", () => {
            state.gameState = "customize";
            state.hardRerender(state);
        });
    return state;
};
export const infoEvent = (state) => {
    const selector = ".sudoku-info";
    const info = state.panel.querySelector(selector);
    if (info) {
        info.addEventListener("click", () => {
            state.gameState = "idle-info";
            state.hardRerender(state);
        });
    }
    return state;
};
//# sourceMappingURL=renderIdleMode.js.map
import { BOARD_SIZE, PLAY_MODE_BTNS } from "./constants";
import { Box, createElement, getItems, id } from "./lib";
import { zenModeEvent } from "./renderIdleMode";
import { removeEvent, revealHintEvent, setNoteEvent, undoEvent, } from "./renderPlayMode";
export const renderZenMode = (state) => state.gameState === "play" && state.isZenMode
    ? Box(state)
        .map(zenMode)
        .map(zenModeEvent)
        .map(revealHintEvent)
        .map(setNoteEvent)
        .map(undoEvent)
        .map(removeEvent)
        .fold(id)
    : state;
export const zenMode = (state) => {
    const labels = getItems(PLAY_MODE_BTNS)("sudoku-zen", "sudoku-hint", "sudoku-note", "sudoku-undo", "sudoku-remove");
    const section = createElement({
        tag: "section",
        classname: "zen-mode-section",
    });
    labels.forEach((label) => {
        const height = state.bounds().width / BOARD_SIZE;
        const width = height;
        const btn = createElement({
            tag: "button",
            classname: `sudoku-btns zen-btn ${label}`,
        });
        const l = label.slice("sudoku-".length);
        btn.style.width = `${width}px`;
        btn.style.aspectRatio = "1/1";
        btn.title = l;
        const i = createElement({
            tag: "i",
            classname: `icon-${l}`,
        });
        btn.appendChild(i);
        section.appendChild(btn);
    });
    state.panel.appendChild(section);
    return state;
};
//# sourceMappingURL=renderZenMode.js.map
import { renderNotes, updateSquares } from "./board";
import { BOARD_SIZE } from "./constants";
import { Box, createElement, id } from "./lib";
import { zenModeEvent } from "./renderIdleMode";
import { isPaused, isPlaying } from "./state";
import { setDuplicates } from "./utils";
export const renderPlayMode = (state) => isPlaying(state.gameState) || isPaused(state.gameState)
    ? Box(state)
        .map(playMode)
        .map(toggleGameStateEvent)
        .map(restartGameEvent)
        .map(setNoteEvent)
        .map(removeEvent)
        .map(revealHintEvent)
        .map(undoEvent)
        .map(zenModeEvent)
        .fold(id)
    : state;
export const playMode = (state) => {
    const section = createElement({
        tag: "section",
        classname: "section-controls",
    });
    state.playButtons.forEach((label) => {
        const height = state.bounds().width / BOARD_SIZE;
        const width = height;
        if (hasResumed(state.gameState)(label) || hasPaused(state.gameState)(label))
            return;
        const btn = createElement({
            tag: "button",
            classname: `sudoku-btns sudoku-btns-${label} ${label}`,
        });
        if (!btn)
            return state;
        if (state.isNote && label === "sudoku-note") {
            btn.classList.add("pressed-note");
        }
        const l = label.slice("sudoku-".length);
        const i = createElement({ tag: "i", classname: `icon-${l}` });
        btn.appendChild(i);
        btn.style.width = `${width}px`;
        btn.style.aspectRatio = "1/1";
        section.appendChild(btn);
    });
    state.playModeSection.appendChild(section);
    return state;
};
export const toggleGameStateEvent = (state) => {
    const paused = isPaused(state.gameState);
    const selector = paused ? ".sudoku-play" : ".sudoku-pause";
    const toggleGameState = paused ? "play" : "pause";
    const btn = state.playModeSection.querySelector(selector);
    if (btn)
        btn.addEventListener("click", () => {
            state.gameState = toggleGameState;
            state.hardRerender(state);
        });
    return state;
};
export const removeEvent = (state) => {
    const selector = ".sudoku-remove";
    const btn = state.panel.querySelector(selector);
    if (btn)
        btn.addEventListener("click", () => {
            state.selectedSquares.map((key) => {
                if (state.readonlySquares.get(key) !== "0")
                    return;
                state.squares.set(key, "0");
                state.notes.set(key, new Set());
                state.duplicates = new Map();
            });
            Box(state)
                .map(renderNotes)
                .map(setDuplicates)
                .map(updateSquares)
                .fold(id);
        });
    return state;
};
export const revealHintEvent = (state) => {
    const selector = ".sudoku-hint";
    const btn = state.panel.querySelector(selector);
    if (btn) {
        btn.addEventListener("click", () => {
            state.selectedSquares.forEach((key) => {
                if (state.solutions.get(key) !== "0") {
                    const value = state.solutions.get(key);
                    if (value !== undefined && value !== "0") {
                        state.squares.set(key, value);
                    }
                }
            });
            Box(state)
                .map(renderNotes)
                .map(setDuplicates)
                .map(updateSquares)
                .fold(id);
        });
    }
    return state;
};
export const undoEvent = (state) => {
    const selector = ".sudoku-undo";
    const btn = state.panel.querySelector(selector);
    if (btn)
        btn.addEventListener("pointerdown", () => {
            if (isPlaying(state.gameState) && state.lastMoves.length > 0) {
                const last = state.lastMoves.length - 1;
                state.readonlySquares.set(state.lastMoves[last], "0");
                state.squares.set(state.lastMoves[last], "0");
                state.lastMoves = state.lastMoves.filter((r) => r !== state.lastMoves[last]);
                return Box(state)
                    .map(setDuplicates)
                    .map(renderNotes)
                    .map(updateSquares)
                    .fold(id);
            }
        });
    return state;
};
export const restartGameEvent = (state) => {
    const selector = ".sudoku-restart";
    const btn = state.panel.querySelector(selector);
    if (!btn)
        return state;
    btn.addEventListener("click", () => {
        location.reload();
    });
    return state;
};
export const setNoteEvent = (state) => {
    const selector = ".sudoku-note";
    const btn = state.panel.querySelector(selector);
    if (btn)
        btn.addEventListener("click", () => {
            state.isNote = !state.isNote;
            if (state.isNote)
                btn.classList.add("pressed-note");
            else
                btn.classList.remove("pressed-note");
        });
    return state;
};
const hasPaused = (gameState) => (label) => isPaused(gameState) && label === "sudoku-pause";
const hasResumed = (gameState) => (label) => isPlaying(gameState) && label === "sudoku-play";
//# sourceMappingURL=renderPlayMode.js.map
import { renderNotes, updateSquares } from "./board";
import { BOARD_SIZE } from "./constants";
import { Box, createElement, id } from "./lib";
import { isPlaying } from "./state";
import { addNote, addUserInput, removingAllRelatedNotes, setDuplicates, } from "./utils";
export const renderDigits = (state) => !isPlaying(state.gameState) || state.isZenMode
    ? state
    : Box(state).map(renderDigitsButtons).map(digitEvents).fold(id);
export const renderDigitsButtons = (state) => {
    const { bounds } = state;
    const digitElement = createElement({
        tag: "section",
        classname: "sudoku-digits",
    });
    state.digitElement = digitElement;
    const width = state.bounds().width / BOARD_SIZE;
    for (const v of state.digits) {
        const btn = createElement({ tag: "button", classname: "digit btn" });
        btn.style.width = `${width}px`;
        btn.style.aspectRatio = `1 / 1`;
        btn.dataset.value = v;
        btn.innerHTML = v;
        btn.style.height = `${bounds().height / BOARD_SIZE}px`;
        state.digitElement.appendChild(btn);
    }
    state.panel.appendChild(state.digitElement);
    return state;
};
export const digitEvents = (state) => {
    const digits = state.digitElement;
    digits.querySelectorAll(`button`).forEach((btn) => {
        btn.addEventListener("click", () => {
            state.selectedSquares.map((key) => {
                const value = btn.dataset.value;
                if (!value)
                    return;
                if (state.isNote) {
                    addNote(state)(key)(value);
                }
                else {
                    removingAllRelatedNotes(state)(key)(value);
                    addUserInput(state)(key)(value);
                }
                Box(state)
                    .map(setDuplicates)
                    .map(updateSquares)
                    .map(renderNotes)
                    .fold(id);
            });
        });
    });
    return state;
};
//# sourceMappingURL=renderDigits.js.map
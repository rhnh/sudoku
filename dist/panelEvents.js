import { getCells } from "./sudoku.algo";
import { addNewValue, isInitialed, isPaused, isPlaying } from "./utils";
/**
 * This looks amateur. This need to change and should be saved in a map or an array
 * @param state
 * @returns
 */
export function panelEvents(state) {
    const { ctrlBTNSection: nav, sidePanel } = state;
    const start = nav.querySelector("#start");
    if (!start)
        return state;
    start.addEventListener("pointerdown", () => {
        if (isInitialed(state.gameState)) {
            state.gameState = "isPlaying";
        }
        else if (isPaused(state.gameState)) {
            state.gameState = "isPlaying";
        }
        else if (isPlaying(state.gameState)) {
            state.gameState = "isPaused";
        }
        else {
        }
        state.rerender(state);
    });
    const restart = nav.querySelector("#restart");
    restart.addEventListener("pointerdown", () => {
        document.location.reload();
    });
    const note = nav.querySelector("#note");
    note.addEventListener("pointerdown", () => {
        state.isNote = !state.isNote;
        if (state.isNote) {
            note.classList.add("btn-pressed");
        }
        else {
            note.classList.remove("btn-pressed");
        }
    });
    const remove = nav.querySelector("#remove");
    remove.addEventListener("pointerdown", () => {
        state.selected.map((r) => {
            if (state.originCell.get(r) !== "0") {
            }
            else {
                state.cells.set(r, "0");
                state.notes.set(r, new Set());
                state.duplicates = new Map();
            }
        });
        state.rerender(state);
    });
    const showHint = nav.querySelector("#hint");
    showHint.addEventListener("pointerdown", () => {
        if (isPlaying(state.gameState)) {
            const selected = state.selected;
            selected.map((s) => {
                const value = state.solutions.get(s);
                addNewValue(state, value);
                state.rerender(state);
            });
        }
    });
    const showUndo = nav.querySelector("#undo");
    showUndo.addEventListener("pointerdown", () => {
        if (isPlaying(state.gameState) && state.lastMoves.length > 0) {
            const last = state.lastMoves.length - 1;
            state.originCell.set(state.lastMoves[last], "0");
            state.cells.set(state.lastMoves[last], "0");
            state.lastMoves = state.lastMoves.filter((r) => r !== state.lastMoves[last]);
            state.duplicates.clear();
            state.rerender(state);
        }
    });
    const timer = nav.querySelector("#timer");
    if (timer) {
        timer.addEventListener("pointerdown", () => {
            const timerText = timer.firstChild;
            timerText.classList.toggle("hide");
        });
    }
    const content = sidePanel.querySelector(".content");
    const zen = sidePanel.querySelector(".s-btn-section > .zen-btn");
    if (zen)
        zen.addEventListener("pointerdown", () => {
            if (isPlaying(state.gameState) && content)
                content.classList.toggle("zen");
        });
    const easyBtn = sidePanel.querySelector(".easy-btn");
    if (easyBtn) {
        easyBtn.addEventListener("pointerdown", () => {
            const DIFFICULTY = 47;
            state.cells = new Map();
            state.solutions = new Map();
            state.rerender(state);
            const cells = getCells(DIFFICULTY);
            state.cells = cells.cells;
            state.originCell = cells.cells;
            state.solutions = cells.solutions;
            state.rerender(state);
        });
    }
    const mediumBtn = sidePanel.querySelector(".medium-btn");
    if (mediumBtn) {
        const DIFFICULTY = 47;
        mediumBtn.addEventListener("pointerdown", () => {
            state.cells = new Map();
            state.solutions = new Map();
            state.rerender(state);
            const cells = getCells(DIFFICULTY);
            state.cells = cells.cells;
            state.originCell = cells.cells;
            state.solutions = cells.solutions;
            state.rerender(state);
        });
    }
    const hardBTN = sidePanel.querySelector(".hard-btn");
    if (hardBTN) {
        const DIFFICULTY = 67;
        hardBTN.addEventListener("pointerdown", () => {
            state.cells = new Map();
            state.solutions = new Map();
            state.rerender(state);
            const cells = getCells(DIFFICULTY);
            state.cells = cells.cells;
            state.originCell = cells.cells;
            state.solutions = cells.solutions;
            state.rerender(state);
        });
    }
    const expertBtn = sidePanel.querySelector(".expert-btn");
    if (expertBtn) {
        const DIFFICULTY = 67;
        expertBtn.addEventListener("pointerdown", () => {
            state.cells = new Map();
            state.solutions = new Map();
            state.rerender(state);
            const cells = getCells(DIFFICULTY);
            state.cells = cells.cells;
            state.originCell = cells.cells;
            state.solutions = cells.solutions;
            state.rerender(state);
        });
    }
    return state;
}
//# sourceMappingURL=panelEvents.js.map
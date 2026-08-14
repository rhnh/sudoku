import { renderCells } from "./render";
import { addNewValue } from "./utils";
export function panelEvents(state) {
    const { nav } = state;
    const start = nav.querySelector("#start");
    if (!start)
        return state;
    start.addEventListener("pointerdown", () => {
        if (state.gameState === "isInitialed") {
            state.gameState = "isPlaying";
            let btn = nav.querySelector("#start");
            btn.innerHTML = `<i class="fa-solid fa-circle-pause"></i>`;
            renderCells(state);
        }
        else if (state.gameState === "isPaused") {
            state.gameState = "isPlaying";
            let btn = nav.querySelector("#start");
            btn.innerHTML = `<i class="fa-solid fa-circle-pause"></i>`;
            renderCells(state);
        }
        else if (state.gameState === "isPlaying") {
            state.gameState = "isPaused";
            let btn = nav.querySelector("#start");
            btn.innerHTML = `<i class="fa-solid fa-forward"></i>`;
            renderCells(state);
        }
        renderCells(state);
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
        if (!state.isNote)
            state.selected.map((r) => {
                if (state.originCell.get(r) !== "0") {
                }
                else {
                    state.cells.set(r, "0");
                    state.duplicates = new Map();
                }
            });
        const found = state.selected
            .map((r) => state.notes.filter((h) => r.slice(0, 2) === h.slice(0, 2)))
            .flat();
        state.notes = state.notes.filter((item) => !found.includes(item));
        renderCells(state);
    });
    const showHint = nav.querySelector("#hint");
    showHint.addEventListener("pointerdown", () => {
        if (state.gameState === "isPlaying") {
            const selected = state.selected;
            selected.map((s) => {
                const value = state.solutions.get(s);
                addNewValue(state, value);
            });
        }
    });
    const showUndo = nav.querySelector("#undo");
    showUndo.addEventListener("pointerdown", () => {
        if (state.gameState === "isPlaying" && state.lastMoves.length > 0) {
            const last = state.lastMoves.length - 1;
            state.originCell.set(state.lastMoves[last], "0");
            state.cells.set(state.lastMoves[last], "0");
            state.lastMoves = state.lastMoves.filter((r) => r != state.lastMoves[last]);
            state.duplicates.clear();
            renderCells(state);
        }
    });
    const timer = nav.querySelector("#timer");
    if (timer) {
        timer.addEventListener("pointerdown", () => {
            const timerText = timer.firstChild;
            timerText.classList.toggle("hide");
        });
    }
    return state;
}
//# sourceMappingURL=panelEvents.js.map
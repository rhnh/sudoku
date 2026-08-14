import { addNote, renderCells } from "./render";
import { addNewValue } from "./utils";
export function keyEvents(state) {
    const { nav } = state;
    document.addEventListener("keydown", (e) => {
        if (e.key === "r") {
            document.location.reload();
        }
        if (state.gameState === "isInitialed") {
            if (e.key === "s") {
                state.gameState = "isPlaying";
                renderCells(state);
            }
        }
        if (state.gameState === "isPlaying") {
            if (e.key === "n") {
                state.isNote = !state.isNote;
                const note = nav.querySelector("#note");
                if (state.isNote) {
                    note.classList.add("btn-pressed");
                }
                else {
                    note.classList.remove("btn-pressed");
                }
            }
        }
        const value = e.key[0];
        const regex = value.match(/\d/);
        if (regex) {
            if (state.isNote) {
                if (!state.targetKey)
                    return;
                addNote(state)(value);
            }
            else
                addNewValue(state, `${value}`);
        }
        renderCells(state);
    });
    return state;
}
//# sourceMappingURL=keyEvent.js.map
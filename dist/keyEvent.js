import { addNote } from "./notes";
import { renderBoard } from "./renderBoard";
import { addNewValue, isInitialed, isPlaying } from "./utils";
export function keyEvents(state) {
    const { ctrlBTNSection: nav } = state;
    document.addEventListener("keydown", (e) => {
        if (e.key === "r") {
            document.location.reload();
        }
        if (isInitialed(state.gameState)) {
            if (e.key === "s") {
                state.gameState = "isPlaying";
                renderBoard(state);
            }
        }
        if (isPlaying(state.gameState)) {
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
        renderBoard(state);
    });
    return state;
}
//# sourceMappingURL=keyEvent.js.map
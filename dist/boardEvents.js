import { renderNotes, updateSquares } from "./board";
import { Box, id } from "./lib";
import { isIdle, isPlaying } from "./state";
import { addNote, addUserInput, setDuplicates } from "./utils";
export function boardKeyEvents(state) {
    const handler = (e) => {
        if (e.metaKey || e.altKey || e.repeat)
            return state;
        const input = e.key.toLowerCase();
        if (input === "r") {
            document.location.reload();
            return state;
        }
        if (isIdle(state.gameState) && input === "s") {
            state.gameState = "play";
            state.hardRerender(state);
            return state;
        }
        if (isPlaying(state.gameState)) {
            if (input === "n") {
                state.isNote = !state.isNote;
                updateSquares(state);
                return state;
            }
            if (e.ctrlKey || input === "z") {
                if (e.key === "z") {
                    const last = state.lastMoves.length - 1;
                    if (last < 0)
                        return state;
                    state.readonlySquares.set(state.lastMoves[last], "0");
                    state.squares.set(state.lastMoves[last], "0");
                    state.lastMoves = state.lastMoves.filter((r) => r !== state.lastMoves[last]);
                    return Box(state)
                        .map(setDuplicates)
                        .map(renderNotes)
                        .map(updateSquares)
                        .fold(id);
                }
            }
            if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
                state.selectedSquares.forEach((key) => {
                    if (state.readonlySquares.get(key) !== "0")
                        return key;
                    state.squares.set(key, "0");
                    state.notes.set(key, new Set());
                    state.duplicates = new Map();
                    return key;
                });
                return Box(state)
                    .map(renderNotes)
                    .map(setDuplicates)
                    .map(updateSquares)
                    .fold(id);
            }
            if (/^[0-9]$/.test(input)) {
                const value = input;
                if (state.isNote) {
                    state.selectedSquares.forEach((key) => {
                        addNote(state)(key)(value);
                    });
                    renderNotes(state);
                    updateSquares(state);
                }
                else {
                    state.selectedSquares.forEach((key) => {
                        state.squares = addUserInput(state)(key)(value);
                    });
                    setDuplicates(state);
                    updateSquares(state);
                    renderNotes(state); // see #2
                }
            }
        }
        return state;
    };
    document.addEventListener("keydown", handler);
    return state;
}
//# sourceMappingURL=boardEvents.js.map
import { BOARD_SIZE } from "./constants";
import { getElementByKey, getSquareNr } from "./utils";
export const addNote = (state) => (value) => {
    state.selected.forEach((selectedKey) => {
        const preSet = state.notes.get(selectedKey);
        if (preSet && preSet.size) {
            if (preSet?.has(value)) {
                preSet.delete(value);
                state.notes.set(selectedKey, preSet);
            }
            else {
                if (state.cells.get(selectedKey) !== "0")
                    return;
                preSet.add(value);
                state.notes.set(selectedKey, preSet);
            }
        }
        else {
            if (state.cells.get(selectedKey) !== "0")
                return;
            const set = new Set();
            set.add(value);
            state.notes.set(selectedKey, set);
        }
    });
};
export function renderNotes(state) {
    let { notes, bounds } = state;
    const cellHeight = bounds().width / BOARD_SIZE;
    const rows = 3; // in one Cell there will be 3 rows
    for (const [key, values] of notes) {
        const el = getElementByKey(state)(key);
        for (const value of values) {
            const [x, y] = getSquareNr(+value);
            const noteElm = document.createElement("note");
            noteElm.style.gridColumn = `${y}`;
            noteElm.style.gridRow = `${x}`;
            noteElm.innerHTML = `${value}`;
            noteElm.style.fontSize = `${cellHeight / rows}px`;
            noteElm.style.display = "flex";
            noteElm.style.alignItems = "center";
            noteElm.style.justifyContent = "center";
            noteElm.style.lineHeight = "1";
            el?.appendChild(noteElm);
        }
    }
    return state;
}
//# sourceMappingURL=notes.js.map
import { addNote, renderBoard } from "./render";
import { addNewValue } from "./utils";
export const createNumPad = (state) => {
    const { bounds, numPad } = state;
    numPad.innerHTML = "";
    for (const [k, i] of state.digits) {
        const el = document.createElement("button");
        el.classList.add("num");
        el.style.height = `${bounds().height / 9}px`;
        el.dataset.value = `${i}`;
        el.innerHTML = `${i}`;
        el.dataset.key = `${k}`;
        el.style.aspectRatio = `${1 / 1}`;
        numPad.appendChild(el);
    }
    return state;
};
export const numPadEvents = (state) => {
    const { numPad } = state;
    numPad.querySelectorAll("*").forEach((button) => {
        const btn = button;
        btn.addEventListener("click", () => {
            const value = btn.dataset.value;
            if (!value)
                return;
            if (state.isNote)
                addNote(state)(value);
            else
                addNewValue(state, value);
            renderBoard(state);
        });
    });
    return state;
};
//# sourceMappingURL=numpad.js.map
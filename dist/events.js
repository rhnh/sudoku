import { addNote, renderBoard } from "./render";
import { getPositionKeyAtDom, getKeyFromPosition, getElementByKey, getCommons, addNewValue, } from "./utils";
export const events = (state) => {
    const { board } = state;
    board.addEventListener("pointerdown", pointerDown(state));
    board.addEventListener("pointerup", pointerup(state));
    board.addEventListener("pointermove", pointermove(state));
    return state;
};
const getCoordinate = (e) => {
    if ("touches" in e) {
        const touch = e.touches[0];
        return [touch.clientX, touch.clientY];
    }
    return [e.clientX, e.clientY];
};
const getKey = (state) => (e) => {
    const [x, y] = getCoordinate(e);
    const position = getPositionKeyAtDom(state.bounds())([x, y]);
    return getKeyFromPosition(position);
};
const selectedEmptySquare = (state) => (e, key) => {
    //don't drag this square
    if (e.ctrlKey) {
        state.selected = [...new Set(state.selected), key];
    }
    else {
        state.selected = [...new Set([key])];
    }
    state.isHold = true;
    renderBoard(state);
};
const selectedNonEmptySquare = (state) => (el, key) => {
    state.isDragging = true;
    state.draggingElement = el;
    state.selected = state.selected = [...new Set([key])];
    state.draggingElement.classList.add("selected");
    const value = state.draggingElement.dataset.value;
    if (!value)
        return state;
    state.draggingValue = value;
    return state;
};
const pointerDown = (state) => (e) => {
    const key = getKey(state)(e);
    if (!key)
        return state;
    state.highlight = getCommons(state)(key);
    const el = getElementByKey(state)(key);
    if (!el)
        return state;
    if (el.dataset.value === "0")
        selectedEmptySquare(state)(e, key);
    else
        selectedNonEmptySquare(state)(el, key);
    return state;
};
export const resetDraggingElement = (state) => {
    const p = state.draggingElement?.firstChild;
    if (state.draggingElement && p) {
        p.style.position = "unset";
        p.style.transform = "unset";
    }
    if (!state.draggingElement) {
        return;
    }
    state.draggingElement.classList.remove("selected");
    state.board
        .querySelectorAll(".selected")
        .forEach((s) => s.classList.remove("selected"));
};
export const addNoteOrValue = (state) => {
    const value = state.draggingValue;
    if (state.isNote)
        addNote(state)(value);
    else
        addNewValue(state, value);
};
export const stopDragging = (state) => {
    state.draggingElement = undefined;
    state.isDragging = false;
    state.draggingValue = undefined;
};
export const fillNewSelectedCells = (state) => (key) => {
    state.isHold = false;
    state.targetKey = key;
    state.selected = [...new Set([...state.selected, key])];
};
export const pointerup = (state) => (e) => {
    const key = getKey(state)(e);
    if (!key)
        return state;
    if (state.gameState !== "isPlaying")
        return state;
    fillNewSelectedCells(state)(key);
    if (state.isDragging && state.draggingElement) {
        resetDraggingElement(state);
        addNoteOrValue(state);
    }
    stopDragging(state);
    renderBoard(state);
    return state;
};
const moveDraggingElement = (state) => (position) => {
    const [x, y] = position;
    const p = state.draggingElement?.firstChild;
    if (state.draggingElement && p) {
        p.style.position = "absolute";
        p.style.transform = `translate(${x -
            state.draggingElement?.getBoundingClientRect().left -
            state.draggingElement?.getBoundingClientRect().width / 3}px, ${y - state.draggingElement?.getBoundingClientRect().top - state.draggingElement?.getBoundingClientRect().height / 3}px)`;
    }
};
const pointermove = (state) => (e) => {
    if (state.gameState !== "isPlaying")
        return;
    const [x, y] = getCoordinate(e);
    const key = getKey(state)(e);
    if (state.isHold) {
        if (!key)
            return;
        fillNewSelectedCells(state)(key);
        renderBoard(state);
    }
    if (state.isDragging)
        moveDraggingElement(state)([x, y]);
};
//# sourceMappingURL=events.js.map
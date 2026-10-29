import { renderNotes, updateSquares } from "./board";
import { Box, id } from "./lib";
import { isPlaying } from "./state";
import { addNote, addUserInput, getCommons, getKeyFromPosition, getPositionKeyAtDom, isEmptySquare, removeAllNotes, removingAllRelatedNotes, setDuplicates, } from "./utils";
export const boardMouseEvent = (state) => {
    const { squaresElement: board } = state;
    board.addEventListener("pointerdown", pointerdown(state));
    board.addEventListener("pointermove", pointermove(state));
    board.addEventListener("pointerup", pointerup(state));
    return state;
};
export const isReadonly = (state) => (key) => state.readonlySquares.get(key) !== "0" && !!state.readonlySquares.get(key);
const pointerdown = (state) => (e) => {
    const key = getKeyFromEvent(state)(e);
    if (!key)
        return state;
    selectSquare(state)(e)(key);
    state.highlightedSquares = getCommons(state)(key);
    updateSquares(state);
    return state;
};
const pointerup = (state) => (e) => {
    if (state.isDragging) {
        if (!state.sourceElement || !state.sourceElement.firstChild)
            return;
        state.sourceElement.style.zIndex = "unset";
        const p = state.sourceElement.firstChild;
        p.style.transform = "unset";
        p.style.position = "unset";
        p.classList.remove("dragging");
        const key = getKeyFromEvent(state)(e);
        if (!key)
            return state;
        if (!state.sourceKey)
            return;
        const value = state.squares.get(state.sourceKey);
        if (!value)
            return;
        state.selectedSquares = [...new Set([key])];
        if (state.readonlySquares.get(key) &&
            state.readonlySquares.get(key) !== "0") {
            state.isDragging = false;
            return;
        }
        if (state.isNote) {
            if (state.squares.get(key) !== state.readonlySquares.get(key) &&
                state.squares.get(key) !== "0") {
                state.squares.set(key, "0");
                addNote(state)(key)(value);
                Box(state)
                    .map((s) => s.hardRerender(s))
                    .map(setDuplicates)
                    .map(renderNotes)
                    .map(updateSquares)
                    .fold(id);
            }
            else {
                addNote(state)(key)(value);
                Box(state)
                    .map(setDuplicates)
                    .map(renderNotes)
                    .map(updateSquares)
                    .fold(id);
            }
        }
        else {
            removeAllNotes(state)(key);
            removingAllRelatedNotes(state)(key)(value);
            addUserInput(state)(key)(value);
            Box(state)
                .map(setDuplicates)
                .map(renderNotes)
                .map(updateSquares)
                .fold(id);
        }
        state.isDragging = false;
    }
    return state;
};
export const setHighlight = (state) => (key) => {
    state.highlightedSquares = getCommons(state)(key);
};
export const stopDragging = (state) => {
    state.sourceElement = undefined;
    state.isDragging = false;
    state.sourceValue = undefined;
};
const pointermove = (state) => (e) => {
    if (!isPlaying(state.gameState))
        return;
    if (state.isDragging) {
        moveDraggingElement(state)(getCoordinate(e));
    }
    const key = getKeyFromEvent(state)(e);
    if (!key)
        return;
    if (state.isHold) {
        state.isHold = false;
        state.targetKey = key;
        if (state.selectedSquares)
            state.selectedSquares = [...new Set([...state.selectedSquares, key])];
    }
};
const moveDraggingElement = (state) => ([x, y]) => {
    const square = state.sourceElement;
    const p = square.firstChild;
    if (!p)
        return;
    square.style.zIndex = "10000";
    const sq = square.getBoundingClientRect();
    p.classList.add("dragging");
    p.style.position = "absolute";
    p.style.zIndex = "10000";
    p.style.display = "flex";
    p.style.alignItems = "center";
    p.style.justifyContent = "center";
    p.style.boxSizing = "border-box";
    p.style.width = `${sq.width * 0.8}px`;
    p.style.height = `${sq.height * 0.8}px`;
    p.style.borderRadius = "5px";
    p.style.transform = "none";
    const r = p.getBoundingClientRect();
    const dx = x - (r.left + r.width / 2);
    const dy = y - (r.top + r.height / 2);
    p.style.transform = `translate(${dx}px, ${dy}px)`;
};
const getKeyFromEvent = (state) => (e) => {
    const [x, y] = getCoordinate(e);
    const position = getPositionKeyAtDom(state.bounds())([x, y]);
    return getKeyFromPosition(position);
};
const getCoordinate = (e) => {
    if ("touches" in e) {
        const touch = e.touches[0];
        return [touch.clientX, touch.clientY];
    }
    return [e.clientX, e.clientY];
};
export const selectSquare = (state) => (e) => (key) => {
    if (isEmptySquare(state)(key)) {
        if (e.ctrlKey) {
            state.selectedSquares = [...new Set(state.selectedSquares), key];
            state.selectedSquares = state.selectedSquares.filter((k) => state.readonlySquares.get(k) && state.readonlySquares.get(k) === "0");
            state.isHold = false;
        }
        else {
            state.selectedSquares = [...new Set([key])];
            state.isHold = true;
        }
    }
    else {
        state.selectedSquares = [...state.selectedSquares, ...new Set([key])];
        state.isHold = true;
        state.sourceElement =
            state.board.querySelector(`[data-key="${key}"]`) ??
                undefined;
        state.sourceKey = key;
        state.isDragging = true;
    }
};
//# sourceMappingURL=board-mouse-events.js.map
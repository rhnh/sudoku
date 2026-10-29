import { renderNotes, updateSquares } from "./board";
import { Box, id } from "./lib";
import { isPlaying, type State } from "./state";
import type { Key, MouchEvent, Position } from "./types";
import {
  addNote,
  addUserInput,
  getCommons,
  getKeyFromPosition,
  getPositionKeyAtDom,
  isEmptySquare,
  removeAllNotes,
  removingAllRelatedNotes,
  setDuplicates,
} from "./utils";

export const boardMouseEvent = (state: State): State => {
  const { squaresElement: board } = state;
  board.addEventListener("pointerdown", pointerdown(state));

  board.addEventListener("pointermove", pointermove(state));

  board.addEventListener("pointerup", pointerup(state));

  return state;
};

export const isReadonly = (state: State) => (key: Key) =>
  state.readonlySquares.get(key) !== "0" && !!state.readonlySquares.get(key);

const pointerdown = (state: State) => (e: PointerEvent) => {
  const key = getKeyFromEvent(state)(e);
  if (!key) return state;

  selectSquare(state)(e)(key);

  state.highlightedSquares = getCommons(state)(key);
  updateSquares(state);

  return state;
};

export const setHighlight = (state: State) => (key: Key) => {
  state.highlightedSquares = getCommons(state)(key);
};

export const stopDragging = (state: State) => {
  state.sourceElement = undefined;
  state.isDragging = false;
  state.sourceValue = undefined;
};

const pointermove = (state: State) => (e: PointerEvent) => {
  if (!isPlaying(state.gameState)) return;

  if (state.isDragging) {
    moveDraggingElement(state)(getCoordinate(e));
  }

  const key = getKeyFromEvent(state)(e);
  if (!key) return;

  if (state.isHold) {
    state.isHold = false;
    state.targetKey = key;
    if (state.selectedSquares)
      state.selectedSquares = [...new Set([...state.selectedSquares, key])];
  }
};
const pointerup = (state: State) => (e: PointerEvent) => {
  if (state.isDragging) {
    if (!state.sourceElement || !state.sourceElement.firstChild) return;
    state.sourceElement.style.zIndex = "unset";

    const p = state.sourceElement.firstChild as HTMLParagraphElement;
    p.style.transform = "unset";
    p.style.position = "unset";
    p.classList.remove("dragging");
    const key = getKeyFromEvent(state)(e);
    if (!key) return state;
    if (!state.sourceKey) return;
    const value = state.squares.get(state.sourceKey);
    if (!value) return;
    state.selectedSquares = [...new Set([key])];
    if (
      state.readonlySquares.get(key) &&
      state.readonlySquares.get(key) !== "0"
    ) {
      state.isDragging = false;
      return;
    }
    if (state.isNote) {
      if (state.squares.get(key) !== "0") {
        state.selectedSquares = state.selectedSquares.filter((k) => key === k);
        state.isDragging = false;
        return state;
      }
      if (state.squares.get(key) !== state.readonlySquares.get(key)) {
        console.log(" is it here");
        state.squares.set(key, "0");
        addNote(state)(key)(value);
        Box(state)
          .map(setDuplicates)
          .map(renderNotes)
          .map(updateSquares)
          .fold(id);
      } else {
        addNote(state)(key)(value);
        Box(state)
          .map(setDuplicates)
          .map(renderNotes)
          .map(updateSquares)
          .fold(id);
      }
    } else {
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
const moveDraggingElement =
  (state: State) =>
  ([x, y]: Position) => {
    const square = state.sourceElement as HTMLElement;
    const p = square.firstChild as HTMLParagraphElement | null;
    if (!p) return;

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

const getKeyFromEvent =
  (state: State) =>
  (e: MouchEvent): Key | undefined => {
    const [x, y] = getCoordinate(e);
    const position = getPositionKeyAtDom(state.bounds())([x, y]);
    return getKeyFromPosition(position);
  };

const getCoordinate = (e: MouseEvent | TouchEvent): Position => {
  if ("touches" in e) {
    const touch = e.touches[0];
    return [touch.clientX, touch.clientY];
  }

  return [e.clientX, e.clientY];
};

export const selectSquare = (state: State) => (e: MouchEvent) => (key: Key) => {
  if (isEmptySquare(state)(key)) {
    if (e.ctrlKey) {
      state.selectedSquares = [...new Set(state.selectedSquares), key];
      state.selectedSquares = state.selectedSquares.filter(
        (k) =>
          state.readonlySquares.get(k) && state.readonlySquares.get(k) === "0",
      );

      state.isHold = false;
    } else {
      state.selectedSquares = [...new Set([key])];
      state.isHold = true;
    }
  } else {
    state.selectedSquares = [...state.selectedSquares, ...new Set([key])];
    state.isHold = true;
    state.sourceElement =
      state.board.querySelector<HTMLElement>(`[data-key="${key}"]`) ??
      undefined;
    state.sourceKey = key;
    state.isDragging = true;
  }
};

import { numPadEvents } from "./events";
import { type CellElement, type Key, type State } from "./types";
import {
  getPositionFromBound,
  keyToPosition,
  hValueToPosition,
  getElementByKey,
  Box,
  memo,
  id,
} from "./utils";

export function renderBase(state: State): State {
  const container = document.getElementById("container");
  if (!container) {
    throw new Error('Not HtmlElement found with id "container"');
  }
  const bounds = memo(() => container.getBoundingClientRect());
  const board = document.createElement("board");
  container.appendChild(board);

  const numPad = document.createElement("numpad");
  container.appendChild(numPad);

  state = { ...state, board, numPad, bounds };

  return state;
}

export function renderCells(state: State): State {
  requestAnimationFrame(() => {
    const { board, cells } = state;
    board.innerHTML = "";
    for (const [k, v] of cells) {
      const cellElem = document.createElement("cell") as CellElement;

      const p = keyToPosition(k as Key);
      const pos = getPositionFromBound(state, p);
      cellElem.style.transform = `translate(${pos[0]}px, ${pos[1]}px)`;
      cellElem.style.position = "absolute";
      cellElem.style.height = `${state.bounds().height / 9}px`;
      cellElem.style.width = `${state.bounds().width / 9}px`;
      const selectedEl = state.selected.find((x) => k == x);
      if (selectedEl) {
        cellElem.classList.add("selected");
      }
      cellElem.dataset.key = `${k}`;
      cellElem.dataset.value = `${v}`;
      if (k.endsWith("111")) {
        cellElem.classList.add("cell-top-row");
      }
      if (k.startsWith("i")) {
        cellElem.classList.add("cell-right-row");
      }
      const c = document.createElement("p");
      c.style.gridArea = "2 / 2 / 3 / 3";
      if (v !== "0") c.innerHTML = `${v}`;
      cellElem.appendChild(c);
      board.appendChild(cellElem);
    }
  });
  return state;
}

export function renderHints(state: State): State {
  const { hints } = state;
  hints.map((h) => {
    const value = +h.slice(-1);
    const key = h.slice(0, 2) as unknown as Key;
    const el = getElementByKey(state)(key);
    const [x, y] = hValueToPosition(value);
    const hint = document.createElement("hint") as CellElement;
    hint.style.gridColumn = `${y} / 3`;
    hint.style.gridRow = `${x} / 3`;
    hint.innerHTML = `${value}`;

    if (el?.dataset.value === "0") el?.appendChild(hint);
  });
  return state;
}

export const render = (state: State): State => {
  return Box(state)
    .map(renderCells)
    .map(renderHints)
    .map(renderNumpad)
    .fold(id);
};
export const createNumPad = (state: State): State => {
  const { bounds, numPad } = state;
  numPad.innerHTML = "";
  numPad.style.height = `${bounds().height / 9}px`;
  numPad.style.maxWidth = `${bounds().width}px`;
  for (const [k, i] of state.digits) {
    const el = document.createElement("div");
    el.classList.add("num");
    el.dataset.value = `${i}`;
    el.innerHTML = `${i}`;
    el.dataset.key = `${k}`;
    numPad.appendChild(el);
  }
  return state;
};
export const renderNumpad = (state: State): State =>
  Box(createNumPad(state)).map(numPadEvents).fold(id);

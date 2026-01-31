import type { CellElement, Key, State } from "./types";
import {
  getPositionFromBound,
  keyToPosition,
  hValueToPosition,
  getElementByKey,
  Box,
  initState,
} from "./utils";

export function renderBase(state: State): State {
  const { container, board } = state;
  container.appendChild(board);
  return state;
}

export function renderCells(state: State): State {
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
    cellElem.dataset.key = `${k}`;
    cellElem.dataset.value = `${v}`;
    const c = document.createElement("p");
    c.style.gridArea = "2 / 2 / 3 / 3";
    if (v !== "0") c.innerHTML = `${v}`;
    cellElem.appendChild(c);
    board.appendChild(cellElem);
  }
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
  requestAnimationFrame(() => {
    Box(state).map(renderBase).map(renderCells).map(renderHints);
  });
  return state;
};

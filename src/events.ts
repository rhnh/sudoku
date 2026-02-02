import { renderCells } from "./render";
import type { BaseKey, Key, Rank, State } from "./types";
import {
  getPositionKeyAtDom,
  getKeyFromPosition,
  getElementByKey,
  getDigitFromPosition,
} from "./utils";

export const events = (state: State): State => {
  const { board } = state;
  board.addEventListener("pointerdown", (e) => {
    const { clientX: x, clientY: y } = e;
    const t = getPositionKeyAtDom(state.bounds())([x, y]);
    const key = getKeyFromPosition(t) as Key;
    if (state.selected.find((k) => k === key)) {
      state.selected = state.selected.filter((k) => k !== key);
      renderCells(state);
      return state;
    }
    if (key) state.selected.push(key);
    renderCells(state);
  });

  return state;
};

export const numPadEvents = (state: State): State => {
  const { numPad } = state;

  numPad.addEventListener("pointerdown", (e) => {
    const { clientX: x, clientY: y } = e;
    const t = getPositionKeyAtDom(numPad.getBoundingClientRect())([x, y], 9, 1);
    const key = getDigitFromPosition(t) as unknown as BaseKey;
    const value = state.digits.get(key) as unknown as Rank;

    state.selected.map((s) => {
      state.cells.set(s, value);
    });
    renderCells(state);
    state.selected = [];
  });

  return state;
};

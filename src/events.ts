import type { State } from "./types";
import { getKeyAtDomPos, getKeyFromPosition } from "./utils";

export const events = (state: State): State => {
  const { board } = state;

  board.addEventListener("pointerdown", (e) => {
    const { clientX: x, clientY: y } = e;
    const t = getKeyAtDomPos([x, y], state.bounds());
    console.log(t);
  });

  return state;
};

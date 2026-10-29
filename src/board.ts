import { BOARD_SIZE } from "./constants";
import { isPlaying, type SquareElement, type State } from "./state";
import type { Key } from "./types";
import {
  getPositionFromBound,
  getPositionFromKey,
  getSquareNr,
  isEmptySquare,
} from "./utils";

export function renderSquares(state: State): State {
  const { squaresElement, squares } = state;
  if (!isPlaying(state.gameState)) return state;
  squaresElement.replaceChildren();
  for (const [k, v] of squares) {
    const square = document.createElement("square") as SquareElement;
    const position = getPositionFromKey(k as Key);
    const pos = getPositionFromBound(state)(position);

    square.style.transform = `translate(${pos[0]}px, ${pos[1]}px)`;
    square.style.position = "absolute";
    square.style.height = `${state.bounds().height / BOARD_SIZE}px`;
    square.style.width = `${state.bounds().width / BOARD_SIZE}px`;

    square.dataset.key = `${k}`;
    square.dataset.value = `${v}`;

    const p = document.createElement("p");
    p.style.gridArea = "2 / 2 / 3 / 3";
    if (v === "0") p.textContent = "";
    else p.textContent = v;
    if (state.readonlySquares.get(k) !== "0") {
      square.classList.add("readonly-squares");
      p.classList.add("readonly-square-p");
    }
    p.classList.add("square-p");
    square.appendChild(p);
    squaresElement.appendChild(square);
  }
  return state;
}

const getBoardSize = (state: State): number =>
  state.container.getBoundingClientRect().width;

export function updateSquares(state: State): State {
  const { squaresElement, squares } = state;

  for (const [k, v] of squares) {
    const square = squaresElement.querySelector<SquareElement>(
      `[data-key="${k}"]`,
    );
    if (!square) continue; // shouldn't happen if renderSquares ran first
    const selected = new Set(state.selectedSquares);
    const position = getPositionFromKey(k as Key);
    const pos = getPositionFromBound(state)(position);
    const boardSize = getBoardSize(state);
    const squareSize = boardSize / BOARD_SIZE;

    square.style.transform = `translate(${pos[0]}px, ${pos[1]}px)`;
    square.style.height = `${squareSize}px`;
    square.style.width = `${squareSize}px`;
    square.dataset.value = `${v}`;

    if (state.isNote) {
      square.classList.add("square-note--mode");
    } else {
      if (square.firstChild) {
        square.firstChild.textContent = v === "0" ? "" : `${v}`;
      }
      square.classList.remove("square-note--mode");
    }

    if (state.duplicates.get(k) && state.duplicates.get(k) !== "0") {
      square.classList.add("duplicates");
    } else {
      square.classList.remove("duplicates");
    }

    if (state.readonlySquares.get(k) !== "0" && state.readonlySquares.get(k)) {
      square.classList.add("readonly-squares");
      square.classList.remove("editable-squares");
    } else {
      square.classList.remove("readonly-squares");
      square.classList.add("editable-squares");
    }
    if (state.highlightedSquares.get(k)) {
      square.classList.add("highlighted");
    } else {
      square.classList.remove("highlighted");
    }
    square.classList.toggle("selected", selected.has(k as Key));
    square.classList.toggle("highlighted", !!state.highlightedSquares.get(k));
  }

  return state;
}

export const renderNotes = (state: State): State => {
  const { notes, squaresElement, bounds } = state;
  const fontSize = `${bounds().width / BOARD_SIZE / 3}px`;

  // 1. clear everything rendered last time
  squaresElement.querySelectorAll(".note").forEach((el) => el.remove());

  // 2. rebuild from the data
  for (const [key, values] of notes) {
    if (!isEmptySquare(state)(key)) continue;

    const square = squaresElement.querySelector<SquareElement>(
      `[data-key="${key}"]`,
    );
    if (!square) continue;

    for (const value of values) {
      const [row, col] = getSquareNr(Number(value));
      const noteElm = document.createElement("span");
      noteElm.className = "note";
      noteElm.textContent = value;
      noteElm.style.gridRow = `${row}`;
      noteElm.style.gridColumn = `${col}`;
      noteElm.style.fontSize = fontSize;
      noteElm.style.display = "flex";
      noteElm.style.alignItems = "center";
      noteElm.style.justifyContent = "center";
      noteElm.style.lineHeight = "1";

      square.appendChild(noteElm);
    }
  }
  return state;
};

import { renderNotes, updateSquares } from "./board";
import { BOARD_SIZE } from "./constants";
import { Box, createElement, id } from "./lib";
import { infoEvent, themeEvent, zenModeEvent } from "./renderIdleMode";
import { isPaused, isPlaying, type State } from "./state";
import type { GameState, PlayModeButtons } from "./types";
import { setDuplicates } from "./utils";

export const renderPlayMode = (state: State): State =>
  isPlaying(state.gameState) || isPaused(state.gameState)
    ? Box(state)
        .map(playMode)
        .map(toggleGameStateEvent)
        .map(restartGameEvent)
        .map(setNoteEvent)
        .map(removeEvent)
        .map(revealHintEvent)
        .map(undoEvent)
        .map(zenModeEvent)
        .map(infoEvent)
        .map(themeEvent)
        .fold(id)
    : state;

export const playMode = (state: State): State => {
  const section = createElement({
    tag: "section",
    classname: "section-play--mode",
  });
  state.playButtons.forEach((sudokuLabel) => {
    const height = state.bounds().width / BOARD_SIZE;
    const width = height;
    // if (sudokuLabel === "sudoku-restart") return sudokuLabel;
    if (
      hasResumed(state.gameState)(sudokuLabel) ||
      hasPaused(state.gameState)(sudokuLabel)
    )
      return sudokuLabel;

    const btn = createElement({
      tag: "button",
      classname: `sudoku-btns sudoku-btns-${sudokuLabel} ${sudokuLabel}`,
    });
    if (!btn) return state;
    if (state.isNote && sudokuLabel === "sudoku-note") {
      btn.classList.add("pressed-note");
    }
    const label = sudokuLabel.slice("sudoku-".length);
    const i = createElement({ tag: "i", classname: `icon-${label}` });
    btn.appendChild(i);
    btn.style.width = `${width}px`;
    btn.style.aspectRatio = "1/1";
    section.appendChild(btn);
    return sudokuLabel;
  });

  state.playModeSection.appendChild(section);
  return state;
};

export const toggleGameStateEvent = (state: State): State => {
  const paused = isPaused(state.gameState);
  const selector = paused ? ".sudoku-play" : ".sudoku-pause";
  const toggleGameState = paused ? "play" : "pause";

  const btn = state.playModeSection.querySelector<HTMLButtonElement>(selector);
  if (btn)
    btn.addEventListener("click", () => {
      state.gameState = toggleGameState;

      state.hardRerender(state);
    });

  return state;
};

export const removeEvent = (state: State): State => {
  const selector = ".sudoku-remove";
  const btn = state.panel.querySelector<HTMLButtonElement>(selector);
  if (btn)
    btn.addEventListener("click", () => {
      state.selectedSquares.map((key) => {
        if (state.readonlySquares.get(key) !== "0") return;
        state.squares.set(key, "0");
        state.notes.set(key, new Set());
        state.duplicates = new Map();
      });

      Box(state)
        .map(renderNotes)
        .map(setDuplicates)
        .map(updateSquares)
        .fold(id);
    });
  return state;
};

export const revealHintEvent = (state: State): State => {
  const selector = ".sudoku-hint";
  const btn = state.panel.querySelector<HTMLButtonElement>(selector);

  if (btn) {
    btn.addEventListener("click", () => {
      state.selectedSquares.forEach((key) => {
        if (state.solutions.get(key) !== "0") {
          const value = state.solutions.get(key);
          if (value !== undefined && value !== "0") {
            state.squares.set(key, value);
          }
        }
      });

      Box(state)
        .map(renderNotes)
        .map(setDuplicates)
        .map(updateSquares)
        .fold(id);
    });
  }

  return state;
};
export const undoEvent = (state: State): State => {
  const selector = ".sudoku-undo";
  const btn = state.panel.querySelector<HTMLButtonElement>(selector);
  if (btn)
    btn.addEventListener("pointerdown", () => {
      if (isPlaying(state.gameState) && state.lastMoves.length > 0) {
        const last = state.lastMoves.length - 1;
        state.readonlySquares.set(state.lastMoves[last], "0");
        state.squares.set(state.lastMoves[last], "0");

        state.lastMoves = state.lastMoves.filter(
          (r) => r !== state.lastMoves[last],
        );

        return Box(state)
          .map(setDuplicates)
          .map(renderNotes)
          .map(updateSquares)
          .fold(id);
      }
      return state;
    });

  return state;
};
export const restartGameEvent = (state: State): State => {
  const selector = ".sudoku-restart";
  const btn = state.panel.querySelector<HTMLButtonElement>(selector);
  if (!btn) return state;
  btn.addEventListener("click", () => {
    location.reload();
  });
  return state;
};

export const setNoteEvent = (state: State): State => {
  const selector = ".sudoku-note";
  const btn = state.panel.querySelector<HTMLButtonElement>(selector);
  if (btn)
    btn.addEventListener("click", () => {
      state.isNote = !state.isNote;

      if (state.isNote) btn.classList.add("pressed-note");
      else btn.classList.remove("pressed-note");
    });

  return state;
};

const hasPaused =
  (gameState: GameState) =>
  (label: PlayModeButtons): boolean =>
    isPaused(gameState) && label === "sudoku-pause";

const hasResumed =
  (gameState: GameState) =>
  (label: PlayModeButtons): boolean =>
    isPlaying(gameState) && label === "sudoku-play";

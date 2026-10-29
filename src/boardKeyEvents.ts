import { renderNotes, updateSquares } from "./board";
import { Box, id } from "./lib";
import { isPlaying, type State } from "./state";
import type { Value } from "./types";
import {
  addNote,
  addUserInput,
  removingAllRelatedNotes,
  setDuplicates,
} from "./utils";

export function boardKeyEvents(state: State): State {
  if (state.keyListenerBound) return state;
  state.keyListenerBound = true;
  document.addEventListener("keydown", onKeyDown(state));

  return state;
}

const onKeyDown =
  (state: State) =>
  (e: KeyboardEvent): State => {
    if (e.metaKey || e.altKey || e.repeat) return state;
    if (e.repeat) return state;

    const input = e.key.toLowerCase();

    if (input === "r") {
      document.location.reload();
      return state;
    }

    if (input === " " || e.code === "Space") {
      if (
        state.gameState === "idle" ||
        state.gameState === "over" ||
        state.gameState === "pause"
      ) {
        state.gameState = "play";
        return state.hardRerender(state);
      } else if (state.gameState === "play") {
        state.gameState = "pause";
        return state.hardRerender(state);
      }
      state.hardRerender(state);
      return state;
    }

    if (input === "i") {
      state.isModalOn = !state.isModalOn;

      state.overlay = "info";

      state.hardRerender(state);
    }
    if (input === "ss") {
      state.isModalOn = !state.isModalOn;

      state.overlay = "settings";

      state.hardRerender(state);
    }
    if (input === "t") {
      state.isModalOn = !state.isModalOn;

      state.overlay = "theme";

      state.hardRerender(state);
    }

    if (isPlaying(state.gameState)) {
      if (input === "n") {
        state.isNote = !state.isNote;
        updateSquares(state);
        return state;
      }

      if (
        ((e.ctrlKey && input === "z") || input === "u") &&
        isPlaying(state.gameState)
      ) {
        const last = state.lastMoves.length - 1;
        if (last < 0) return state;
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

      if (input === "z") {
        state.isZenMode = !state.isZenMode;
        state.hardRerender(state);
      }

      if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
        state.selectedSquares.forEach((key) => {
          if (state.readonlySquares.get(key) !== "0") return key;
          state.squares.set(key, "0");
          state.notes.set(key, new Set());
          state.duplicates = new Map();
          return key;
        });

        return Box(state)
          .map(renderNotes)
          .map(setDuplicates)
          .map(updateSquares)
          .fold(id);
      }

      if (/^[0-9]$/.test(input)) {
        const value = input as Value;

        if (state.isNote) {
          state.selectedSquares.forEach((key) => {
            addNote(state)(key)(value);
          });
          Box(state)
            .map(setDuplicates)
            .map(renderNotes)
            .map(updateSquares)
            .fold(id);
        } else {
          state.selectedSquares.forEach((key) => {
            state.squares = addUserInput(state)(key)(value);
            removingAllRelatedNotes(state)(key)(value);
          });

          Box(state)
            .map(setDuplicates)
            .map(renderNotes)
            .map(updateSquares)
            .fold(id);
        }
      }
    }

    return state;
  };

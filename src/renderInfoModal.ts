import { shortcutKeysArray } from "./constants";
import { Box, createElement, id } from "./lib";
import { modal } from "./modal";
import type { State } from "./state";

export const renderInfo = (state: State): State =>
  state.isModalOn && state.overlay === "info"
    ? Box(state).map(info).map(event).fold(id)
    : state;

export const info = (state: State): State => {
  const content = createElement({ tag: "section", classname: "content" });
  content.appendChild(main());
  return modal(state)(content);
};

export const event = (state: State): State => {
  const selector = ".sudoku-close";
  const info = state.board.querySelector<HTMLButtonElement>(selector);

  if (info) {
    info.addEventListener("click", () => {
      state.isModalOn = false;
      state.overlay = undefined;
      state.hardRerender(state);
    });
  }

  return state;
};

const main = (): HTMLElement => {
  const m = createElement({ tag: "section", classname: "main" });
  const shortcutKeys = new Map<string, string>(shortcutKeysArray);
  let sKeys = "";

  for (const [k, v] of shortcutKeys)
    sKeys += `<tr><td><kbd>${k}</kbd></td><td>${v}</tr></tr>`;

  m.innerHTML = `<h3 class='h3'>How to Play Sudoku</h3>
  <p>
    The main object of the game is to fill a 9×9 grid with digits so that
    each column, each row, and each of the nine 3×3 subgrids contains
    all the digits from 1 to 9.
    <br>
    Source:
    <a href="https://en.wikipedia.org/wiki/Sudoku">Sudoku</a>
  </p>

<h3 class='h3'>Keyboard Shortcuts</h3>

<table class="shortcut-table">
  <thead>
    <tr>
      <th>Key</th>
      <th>Function</th>
    </tr>
  </thead>
  <tbody>
  ${sKeys}
  </tbody>
</table>
`;

  return m;
};

import { Box, createElement, id } from "./lib";
import { modal } from "./modal";
export const renderInfo = (state) => state.gameState === "idle-info"
    ? Box(state).map(info).map(event).fold(id)
    : state;
export const info = (state) => {
    const content = createElement({ tag: "section", classname: "content" });
    content.appendChild(main());
    return modal(state)(content);
};
export const event = (state) => {
    const selector = ".sudoku-close";
    const info = state.board.querySelector(selector);
    if (info) {
        info.addEventListener("click", () => {
            state.gameState = "idle";
            state.hardRerender(state);
        });
    }
    return state;
};
const main = () => {
    const m = createElement({ tag: "section", classname: "main" });
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
    <tr>
      <td><kbd>n</kbd></td>
      <td>Toggle notes</td>
    </tr>
    <tr>
      <td><kbd>Z</kbd> / <kbd>Ctrl + z</kbd></td>
      <td>Undo the last move</td>
    </tr>
    <tr>
      <td><kbd>Backspace</kbd> / <kbd>Delete</kbd> / <kbd>0</kbd></td>
      <td>Delete a number</td>
    </tr>
    <tr>
      <td><kbd>1–9</kbd></td>
      <td>Enter a number</td>
    </tr>
    <tr>
      <td><kbd>s</kbd></td>
      <td>Start the game</td>
    </tr>
    <tr>
      <td><kbd>r</kbd></td>
      <td>Reload the game</td>
    </tr>
  </tbody>
</table>
`;
    return m;
};
//# sourceMappingURL=renderInfo.js.map
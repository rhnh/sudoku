import { BOARD_SIZE, PLAY_MODE_BTNS } from "./constants";
import { createElement, getItems } from "./lib";
import type { State } from "./state";

export const modal =
  (state: State) =>
  (content: HTMLElement): State => {
    const section = createElement({
      tag: "section",
      classname: "sudoku-modal",
    });
    section.style.zIndex = `10000`;
    const height = state.bounds().width / BOARD_SIZE;
    const width = height;

    section.style.width = `${width * 8}px`;
    section.style.height = `${width * 8}px`;
    section.style.transform = `translate(${width / 2}px,${width / 2}px)`;
    section.style.position = "absolute";

    content.classList.add("sudoku-modal--content");
    section.appendChild(content);
    const btns = getItems(PLAY_MODE_BTNS)("sudoku-remove");
    btns.forEach((label) => {
      const btn = createElement({
        tag: "button",
        classname: "sudoku-btns sudoku-close",
      });

      btn.title = "close";

      const l = label.slice("sudoku-".length);
      const i = createElement({ tag: "i", classname: `icon-${l}` });
      btn.appendChild(i);
      btn.addEventListener("click", () => {
        state.isModalOn = false;
        state.hardRerender(state);
      });
      section.appendChild(btn);
    });
    // state.panel.replaceChildren();
    state.board.append(section);
    return state;
  };

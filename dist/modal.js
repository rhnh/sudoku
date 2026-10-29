import { BOARD_SIZE, PLAY_MODE_BTNS } from "./constants";
import { createElement, getItems } from "./lib";
export const modal = (state) => (content) => {
    const section = createElement({
        tag: "section",
        classname: "sudoku-modal",
    });
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
        section.appendChild(btn);
    });
    // state.panel.replaceChildren();
    state.board.append(section);
    return state;
};
//# sourceMappingURL=modal.js.map
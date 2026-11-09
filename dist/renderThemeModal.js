import { BOARD_SIZE, themes } from "./constants";
import { Box, createElement, id } from "./lib";
import { modal } from "./modal";
export const renderThemeModal = (state) => state.isModalOn && state.overlay === "theme"
    ? Box(state).map(theme).map(customizationEvent).fold(id)
    : state;
const theme = (state) => {
    console.log("rendering themes");
    const section = createElement({
        tag: "section",
        classname: "sudoku-themes--modal",
    });
    const width = state.bounds().width / BOARD_SIZE;
    const height = width;
    themes.forEach((label) => {
        const btn = createElement({
            tag: "button",
            classname: `sudoku-btns sudoku-themes--btns sudoku-themes--${label}`,
        });
        // btn.style.width = `${width}px`;
        btn.style.height = `${height}px`;
        btn.style.aspectRatio = "1/1";
        btn.innerHTML = label;
        section.appendChild(btn);
    });
    state.customizationElement = section;
    return modal(state)(section);
};
export const customizationEvent = (state) => {
    const selector = "button";
    const btns = state.customizationElement.querySelectorAll(selector);
    btns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const theme = btn.innerText;
            state.currentTheme = theme;
            state.hardRerender(state);
        });
    });
    return state;
};
//# sourceMappingURL=renderThemeModal.js.map
import { BOARD_SIZE, themes } from "./constants";
import { Box, createElement, id } from "./lib";
export const renderCustomization = (state) => state.gameState === "customize"
    ? Box(state).map(customization).map(customizationEvent).fold(id)
    : state;
const customization = (state) => {
    const section = createElement({
        tag: "section",
        classname: "sudoku-customization",
    });
    const width = state.bounds().width / BOARD_SIZE;
    const height = width;
    themes.forEach((label) => {
        const btn = createElement({ tag: "button", classname: "sudoku-btns" });
        // btn.style.width = `${width}px`;
        btn.style.height = `${height}px`;
        // btn.style.aspectRatio = "1/1";
        btn.innerHTML = label;
        section.appendChild(btn);
    });
    state.customizationElement = section;
    state.panel.appendChild(section);
    return state;
};
export const customizationEvent = (state) => {
    const selector = "button";
    const btns = state.customizationElement.querySelectorAll(selector);
    btns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const theme = btn.innerText;
            state.currentTheme = theme;
            state.gameState = "idle";
            state.hardRerender(state);
        });
    });
    return state;
};
//# sourceMappingURL=renderCustomization.js.map
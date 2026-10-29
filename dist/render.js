import { renderNotes, renderSquares, updateSquares } from "./board";
import { boardKeyEvents } from "./boardEvents";
import { configureElements, initButtons } from "./config";
import { Box, id, updateBounds } from "./lib";
import { boardMouseEvent } from "./board-mouse-events";
import { renderGrid } from "./svg";
import { renderTimer } from "./renderTimer.ts";
import { renderCustomization } from "./renderCustomization";
import { renderDigits } from "./renderDigits";
import { renderIdleMode } from "./renderIdleMode";
import { renderInfo } from "./renderInfo";
import { renderPlayMode } from "./renderPlayMode";
import { renderZenMode } from "./renderZenMode";
export const renderSidebar = (state) => {
    const { panel } = state;
    panel.replaceChildren();
    state.root.appendChild(panel);
    return Box(state)
        .map(renderTimer)
        .map(renderIdleMode)
        .map(renderPlayMode)
        .map(renderDigits)
        .map(renderZenMode)
        .map(renderCustomization)
        .map(renderInfo)
        .fold(id);
};
export const renderBase = (state) => {
    const next = {
        ...state,
        ...configureElements(state),
        ...initButtons(),
        updateBoard: (state) => {
            updateSquares(state);
            renderNotes(state);
            return state;
        },
        updateBounds,
        rerender: (state) => {
            state.root.replaceChildren();
            render(state);
            return state;
        },
        hardRerender: (state) => hardRerender(state), // <-- add
    };
    // resizeObserver(next)({ render: render, updateBounds: updateBounds });
    resizeObserver(next);
    return next;
};
export const hardRerender = (state) => {
    state.root.replaceChildren();
    return Box(state).map(render).map(updateSquares).fold(id);
};
export const render = (state) => {
    console.log(state.gameState, "gameState", "render");
    return Box(state)
        .map(renderBase)
        .map(renderSquares)
        .map(boardMouseEvent)
        .map(boardKeyEvents)
        .map(renderGrid)
        .map(renderSidebar)
        .fold(id);
};
export const resizeObserver2 = (state) => {
    const observer = new ResizeObserver(() => {
        requestAnimationFrame(() => {
            if (state.container) {
                state.updateBounds(state);
                state.root.replaceChildren();
                render(state);
            }
        });
    });
    observer.observe(state.root);
    return observer;
};
export const resizeObserver = (state) => {
    const observerCallback = (entries) => {
        window.requestAnimationFrame(() => {
            if (!Array.isArray(entries) || !entries.length) {
                return;
            }
            if (state.container) {
                state.updateBounds(state);
                renderGrid(state);
            }
        });
    };
    new ResizeObserver(observerCallback).observe(state.root);
};
//# sourceMappingURL=render.js.map
import { renderNotes, renderSquares, updateSquares } from "./board";
import { configureElements, initButtons } from "./config";
import { Box, id, updateBounds } from "./lib";
import { boardMouseEvent } from "./boardMouseEvents";
import type { RootedState, State } from "./state";
import { renderGrid } from "./svg";
import { renderTimer } from "./renderTimer.ts";
import { renderThemeModal } from "./renderThemeModal";
import { renderDigits } from "./renderDigits";
import { renderIdleMode } from "./renderIdleMode";
import { renderInfo } from "./renderInfoModal";
import { renderPlayMode } from "./renderPlayMode";
import { renderZenMode } from "./renderZenMode";
import { renderSettings } from "./renderSettingsModal";
import { boardKeyEvents } from "./boardKeyEvents";

export const renderSidebar = (state: State): State => {
  const { panel } = state;
  panel.replaceChildren();
  return Box(state)
    .map(renderTimer)
    .map(renderIdleMode)
    .map(renderPlayMode)
    .map(renderDigits)
    .map(renderZenMode)
    .map(renderThemeModal)
    .map(renderInfo)
    .map(renderSettings)
    .fold(id);
};

export const renderBase = (state: RootedState): State => {
  const next = Object.assign(state, {
    ...configureElements(state),
    ...initButtons(),
    updateBoard: (s: State) => {
      updateSquares(s);
      renderNotes(s);
      return s;
    },
    updateBounds,
    hardRerender: (s: State) => hardRerender(s),
  }) as State;

  resizeObserver(next);
  return next;
};

export const hardRerender = (state: State): State => {
  state.root.replaceChildren();
  return Box(state).map(render).map(updateSquares).fold(id);
};

export const render = (state: State): State => {
  console.log(
    `render: function
    gameState: ${state.gameState},
    overlay: ${state.overlay},
  `,
  );

  return Box(state)
    .map(renderBase)
    .map(renderSquares)
    .map(boardMouseEvent)
    .map(boardKeyEvents)
    .map(renderGrid)
    .map(renderSidebar)
    .fold(id);
};

export const resizeObserver2 = (state: State) => {
  if (state.observer) return state.observer; // never create twice

  let lastWidth = -1;
  let lastHeight = -1;

  const observer = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    if (width === lastWidth && height === lastHeight) return;
    lastWidth = width;
    lastHeight = height;

    requestAnimationFrame(() => {
      if (!state.container) return;
      state.updateBounds(state);
      state.root.replaceChildren();
      render(state);
    });
  });

  observer.observe(state.root);
  state.observer = observer;
  return observer;
};
const resizeObserver = (state: State) => {
  const observerCallback: ResizeObserverCallback = (
    entries: ResizeObserverEntry[],
  ) => {
    window.requestAnimationFrame((): void | undefined => {
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

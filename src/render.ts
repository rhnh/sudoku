import { renderNotes, renderSquares, updateSquares } from './board';
import { boardKeyEvents } from './boardKeyEvents';
import { boardMouseEvent } from './boardMouseEvents';
import { configureElements, initButtons } from './config';
import { Box, id } from './lib';
import { renderDigits } from './renderDigits';
import { renderIdleMode } from './renderIdleMode';
import { renderInfo } from './renderInfoModal';
import { renderPlayMode } from './renderPlayMode';
import { renderSettings } from './renderSettingsModal';
import { renderThemeModal } from './renderThemeModal';
import { renderTimer } from './renderTimer.ts';
import { renderZenMode } from './renderZenMode';
import type { RootedState, State } from './state';
import { renderGrid } from './svg';
import { updateBounds } from './utils';

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

const resizeObserver = (state: State): void => {
  if (state.observer) return;

  let frame: number | null = null;

  const refresh = () => {
    console.log('resize callback'); // remove once confirmed
    if (frame !== null) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = null;
      if (!state.container || !state.root.isConnected) return;
      state.updateBounds(state);
      updateSquares(state);
      state.hardRerender(state);
      renderGrid(state);
    });
  };

  const observer = new ResizeObserver(refresh);
  observer.observe(state.root);
  window.addEventListener('resize', refresh); // fires on every window resize, whatever root does

  state.observer = observer;
};

import { BOARD_SIZE, IDLE_MODE_BTNS } from "./constants";
import { Box, createElement, id } from "./lib";
import { isIdle, type State } from "./state";

export const renderIdleMode = (state: State): State =>
  isIdle(state.gameState)
    ? Box(state)
        .map(renderLevelButtons)
        .map(playEvent)
        .map(zenModeEvent)
        .map(themeEvent)
        .map(infoEvent)
        .map(settingEvent)
        .fold(id)
    : state;

export const renderLevelButtons = (state: State): State => {
  const section = state.idleModeSection;
  if (state.gameState !== "idle") return state;
  const width = state.bounds().width / BOARD_SIZE;
  const height = width;
  IDLE_MODE_BTNS.forEach((sudokuLabel) => {
    const btn = createElement({
      tag: "button",
      classname: `sudoku-btns sudoku-btns-${sudokuLabel} ${sudokuLabel}`,
    });
    const label = sudokuLabel.slice("sudoku-".length);
    const i = createElement({ tag: "i", classname: `icon-${label}` });
    btn.appendChild(i);
    btn.style.width = `${width}px`;
    btn.style.aspectRatio = "1/1";
    btn.title = label;
    section.appendChild(btn);
  });
  for (const v of state.levelButtons) {
    const btn = createElement({
      tag: "button",
      classname: `sudoku-btns ${state.isZenMode ? "zen-mode" : "normal-mode"}`,
    });
    btn.style.height = `${width}px`;
    btn.style.width = `${height}px`;
    btn.innerHTML = v.toLocaleUpperCase();
    section.append(btn);
  }

  state.panel.appendChild(section);
  return state;
};

export const playEvent = (state: State): State => {
  const selector = ".sudoku-play";
  const btn = state.panel.querySelector<HTMLButtonElement>(selector);
  if (!btn) return state;
  btn.addEventListener("click", () => {
    state.gameState = "play";
    return state.hardRerender(state);
  });
  return state;
};

export const zenModeEvent = (state: State): State => {
  const selector = ".sudoku-zen";
  const zen = state.panel.querySelector<HTMLButtonElement>(selector);
  if (zen)
    zen.addEventListener("pointerdown", () => {
      state.isZenMode = !state.isZenMode;
      state.hardRerender(state);
    });

  return state;
};

export const themeEvent = (state: State): State => {
  const selector = ".sudoku-themes";
  const themes = state.panel.querySelector<HTMLButtonElement>(selector);
  if (themes)
    themes.addEventListener("pointerdown", () => {
      state.isModalOn = true;
      state.overlay = "theme";
      state.hardRerender(state);
    });

  return state;
};

export const infoEvent = (state: State): State => {
  const selector = ".sudoku-info";
  const info = state.panel.querySelector<HTMLButtonElement>(selector);
  if (info) {
    info.addEventListener("click", () => {
      state.isModalOn = true;
      state.overlay = "info";
      state.hardRerender(state);
    });
  }

  return state;
};

export const settingEvent = (state: State): State => {
  const selector = ".sudoku-setting";
  const settings = state.panel.querySelector<HTMLButtonElement>(selector);

  if (settings) {
    settings.addEventListener("click", () => {
      state.isModalOn = true;
      state.overlay = "settings";
      state.hardRerender(state);
    });
  }
  return state;
};

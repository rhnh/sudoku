import { DIGITS, LEVELS, PLAY_MODE_BTNS } from "./constants";
import { createElement, memo } from "./lib";
import type {
  AllButtons,
  RootedState,
  SudokuBaseElements,
  SudokuBoardElements,
  SudokuPanelElements,
} from "./state";
import { type Squares, type Theme } from "./types";

export interface Config {
  root: HTMLElement;
  currentTheme?: Theme | string;
  squares: Squares;
  solutions: Squares;
  levelEasy?: number;
  levelMedium?: number;
  levelHard?: number;
  levelExpert?: number;
  maxWidth: number;
}

export const configurePanelElements = (): SudokuPanelElements => {
  const panel = createElement({ tag: "section", classname: "sudoku-panel" });

  const timerElement = createElement({
    tag: "section",
    classname: "sudoku-timer",
  });

  const idleModeSection = createElement({
    tag: "section",
    classname: "sudoku-idle--mode",
  });

  const digitElement = createElement({
    tag: "section",
    classname: "sudoku-digits",
  });

  const playModeSection = createElement({
    tag: "section",
    classname: "sudoku-play--mode",
  });

  const customizationElement = createElement({
    tag: "section",
    classname: "sudoku-customization",
  });

  return {
    panel,
    idleModeSection,
    digitElement,
    playModeSection,
    timerElement,
    customizationElement,
  };
};

export const configureBoardElements = (): SudokuBoardElements => {
  const board = createElement({
    tag: "section",
    classname: "sudoku-board",
  });
  const grid = createElement({
    tag: "section",
    classname: "sudoku-grid",
  });

  const squaresElement = createElement({
    tag: "section",
    classname: "sudoku-squares",
  });

  board.append(grid, squaresElement);
  return {
    squaresElement,
    grid,
    board,
  };
};

export const configureElements = (state: RootedState): SudokuBaseElements => {
  const { root } = state;

  const wrapper = createElement({ tag: "section", classname: "wrapper" });
  root.dataset.theme = state.currentTheme;
  const container = createElement({
    tag: "section",
    classname: "sudoku-container",
  });
  const {
    panel,
    idleModeSection,
    digitElement,
    playModeSection,
    timerElement,
    customizationElement,
  } = configurePanelElements();
  state = { ...state, ...configurePanelElements() };

  const { board, grid, squaresElement } = configureBoardElements();
  wrapper.appendChild(container);
  wrapper.appendChild(panel);
  container.append(board);
  root.appendChild(wrapper);
  const bounds = memo(() => container.getBoundingClientRect());
  const base: SudokuBaseElements = {
    root,
    panel,
    idleModeSection,
    digitElement,
    playModeSection,
    timerElement,
    board,
    grid,
    squaresElement,
    container,
    bounds,
    customizationElement,
  };

  return base;
};

export const initButtons = (): AllButtons => {
  const controlButtons = new Set(PLAY_MODE_BTNS);
  const digits = new Set(DIGITS);
  const levelButtons = new Set(LEVELS);
  const btn: AllButtons = {
    digits,
    playButtons: controlButtons,
    levelButtons,
  };

  return btn;
};

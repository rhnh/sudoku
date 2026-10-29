import type {
  Buttons,
  Digit,
  GameState,
  Key,
  LevelButtons,
  Memo,
  Notes,
  Overlay,
  PlayModeButtons,
  Squares,
  Theme,
  Value,
} from "./types";

export interface DraggingElement {
  isDragging: boolean;
  sourceValue: Value;
  sourceKey: Key;
  targetValue: Value;
  targetKey: Key;
  sourceElement: HTMLElement;
  isHold: boolean;
}

type PlayButtons = Buttons<PlayModeButtons>;
type Levels = Buttons<LevelButtons>;
type Digits = Buttons<Digit>;

export interface AllButtons {
  playButtons: PlayButtons;
  levelButtons: Levels;
  digits: Digits;
}

export interface SquareElement extends HTMLParagraphElement {
  key: Key;
  value: Value;
}

export interface SudokuPanelElements {
  panel: HTMLElement;
  idleModeSection: HTMLElement;
  playModeSection: HTMLElement;
  digitElement: HTMLElement;
  timerElement: HTMLElement;
  customizationElement: HTMLElement;
}

export interface SudokuBoardElements {
  board: HTMLElement;
  grid: HTMLElement;
  squaresElement: HTMLElement;
}

export interface SudokuBaseElements
  extends SudokuBoardElements, SudokuPanelElements {
  root: HTMLElement;
  container: HTMLElement;
  maxWidth?: number;
  bounds: Memo<DOMRectReadOnly>;
}

export interface HeadlessState {
  squares: Squares;
  highlightedSquares: Squares;
  readonlySquares: Readonly<Squares>;
  solutions: Readonly<Squares>;
  duplicates: Squares;
  notes: Notes;
  selectedSquares: Key[];
  currentLevel: number;
  currentTheme: Theme | string;
  gameState: GameState;
  isZenMode: boolean;
  isNote: boolean;
  seconds: number;
  lastMoves: Key[];
  isMuted: boolean;
  isModalOn: boolean;
  keyListenerBound: boolean;
  overlay?: Overlay;
  observer?: ResizeObserver;
}

export interface State
  extends
    SudokuBaseElements,
    Partial<DraggingElement>,
    HeadlessState,
    AllButtons {
  updateBoard: (state: State) => State;
  hardRerender: (state: State) => State;
  updateBounds(state: State): void;
}

export const isIdle = (gameState: GameState) => gameState === "idle";
export const isPaused = (gameState: GameState) => gameState === "pause";
export const isPlaying = (gameState: GameState) => gameState === "play";
export const isOvered = (gameState: GameState) => gameState === "over";

export const isZenMode = (isZenMode: boolean): boolean => !!isZenMode;
export type RootedState = HeadlessState & { root: HTMLElement };

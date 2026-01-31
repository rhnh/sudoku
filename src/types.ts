export const ranks = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
export const files = ["a", "b", "c", "d", "e", "f", "g", "h", "i"] as const;
export type File = (typeof files)[number];
export type Rank = (typeof ranks)[number] | "0";
export type Position = [number, number];

export type BaseKey = `${File}${Rank}`;

export type Hint = `${BaseKey}${Rank}`;
export type Hints = Hint[];
export type Key = `${BaseKey}${Rank}${Rank}${Rank}`;

export type GameState = "isInitialed" | "isPaused" | "isPlaying" | "isOvered";

export type Value = Rank;

export type Cells = Map<Key, Value>;

export interface Memo<A> {
  (): A;
  clear: () => void;
}

export interface State {
  gameState: GameState;
  cells: Cells;
  hints: Hints;
  board: HTMLElement;
  container: HTMLElement;
  bounds: Memo<DOMRectReadOnly>;
}

export interface CellElement extends HTMLElement {
  key: Key;
  value: Value;
  isReadOnly: boolean;
}
export type MouchEvent = Event & Partial<MouseEvent & TouchEvent>;

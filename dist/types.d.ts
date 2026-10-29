import type { FILES, GAME_STATES, LEVELS, modes, PLAY_MODE_BTNS, RANKS, themes } from "./constants";
export type Rank = (typeof RANKS)[number];
export type File = (typeof FILES)[number];
export type GameState = (typeof GAME_STATES)[number];
export type Theme = (typeof themes)[number];
export type Mode = (typeof modes)[number];
export type BaseKey = `${File}${Rank}`;
export type Key = `${BaseKey}${Rank}`;
export type Position = [number, number];
export type Value = Rank | "0";
export type Digit = Value;
export type Squares = Map<Key, Value>;
export type Notes = Map<Key, Set<Value>>;
export interface Memo<A> {
    (): A;
    clear: () => void;
}
export type MouchEvent = MouseEvent | TouchEvent;
export type PlayModeButtons = (typeof PLAY_MODE_BTNS)[number];
export type LevelButtons = (typeof LEVELS)[number];
export type Button = LevelButtons | PlayModeButtons | Digit;
export type Buttons<k extends Button> = Set<k>;
export interface ButtonElement extends HTMLButtonElement {
    key: Key;
    value: Value;
}

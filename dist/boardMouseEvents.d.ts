import { type State } from './state';
import type { Key, MouchEvent } from './types';
export declare const boardMouseEvent: (state: State) => State;
export declare const isReadonly: (state: State) => (key: Key) => boolean;
export declare const setHighlight: (state: State) => (key: Key) => State;
export declare const stopDragging: (state: State) => void;
/**
 * This function selects a square. Ctrl
 * @param state returns state
 * @returns
 */
export declare const selectSquareByMPosition: (state: State) => (e: MouchEvent) => (key: Key) => void;

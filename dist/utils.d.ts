import type { Button, Buttons, Key, Memo, Notes, Position, Squares, Value } from "./types";
import type { SquareElement, State } from "./state";
export declare const getPositionFromKey: (k: Key) => Position;
export declare const getKeyFromPosition: (p: Position) => Key | undefined;
export declare const getKeys: () => Key[];
export declare function getKeysWithSameValue(squares: Squares): Key[];
export declare function updateBounds(s: State): void;
/**
 * Adds new number. It check if is readonly square
 * @param state
 * @returns
 */
export declare const addUserInput: (state: State) => (key: Key) => (value: Value) => Squares;
/**
 * This function add a new to the state.notes.
 * if the note is already in the list. It removes it, otherwise it adds it.
 * @param state
 * @returns
 */
export declare const addNote: (state: State) => (key: Key) => (value: Value) => Notes;
export declare const removeAllNotes: (state: State) => (key: Key) => void;
export declare const removingAllRelatedNotes: (state: State) => (key: Key) => (value: Value) => void;
export declare const getPositionFromBound: (state: State) => (p: Position) => Position;
export declare const isEmptySquare: (state: State) => (k: Key) => boolean;
export declare const getElementByKey: (state: State) => (key: Key) => SquareElement | null;
export declare const getPositionKeyAtDom: (bounds: DOMRectReadOnly) => (pos: Position, xSize?: number, ySize?: number) => Position;
/**
 * returns related squares
 * @param state
 * @returns
 */
export declare const getCommons: (state: State) => (key: Key, noZero?: boolean) => Squares;
export declare const getSquareNr: (n: number) => number[];
export declare const getDuplicates: (state: State) => (f: (key: Key, noZero: boolean) => Squares) => void;
export declare const setDuplicates: (state: State) => State;
export declare const getSquareRow: (state: State) => (key: Key, noZero?: boolean) => Squares;
export declare const getSquareColumn: (state: State) => (key: Key, noZero?: boolean) => Squares;
export declare const getSquareSquare: (state: State) => (key: Key, noZero?: boolean) => Map<any, any>;
/**
 * A square represented by {File}{Rank}{Rank} e.g a11
 * a = row
 * 1  = column
 * 1 = square
 *
 * @param state
 * @returns
 */
export declare const getSquaresBy: (state: State) => (key: Key, noZero?: boolean) => (n: number) => Map<any, any>;
export declare const createButtons: <T extends Button>({ buttons, classname, section, bounds, isFixedSized, hasId, width, height, }: {
    buttons: Buttons<T> | any;
    classname: string;
    bounds: Memo<DOMRectReadOnly>;
    section: HTMLElement;
    isFixedSized?: boolean;
    hasId?: boolean;
    width?: number;
    height?: number;
}) => HTMLElement;

import { BOARD_SIZE, FILES, RANKS } from "./constants";
import { createElement } from "./lib";
export const getPositionFromKey = (k) => [
    k.charCodeAt(0) - 97,
    k.charCodeAt(1) - 49,
];
export const getKeyFromPosition = (p) => {
    const keys = getKeys();
    return p.every((x) => x >= 0 && x <= 8) ? keys[9 * p[0] + p[1]] : undefined;
};
export const getKeys = () => {
    let i = 0;
    return FILES.flatMap((f) => RANKS.flatMap((r) => {
        const row = Math.floor(i / 9);
        const col = i % 9;
        const block = Math.floor(row / 3) * 3 + Math.floor(col / 3) + 1;
        i++;
        return `${f}${r}${block}`;
    }));
};
export function getKeysWithSameValue(squares) {
    const valueMap = new Map();
    const keys = [];
    for (const [key, value] of squares.entries()) {
        const existingKeys = valueMap.get(value) ?? [];
        existingKeys.push(key);
        valueMap.set(value, existingKeys);
    }
    for (const key of valueMap.values()) {
        if (key.length > 1) {
            keys.push(...key);
        }
    }
    return keys;
}
export function updateBounds(s) {
    const bounds = s.root.getBoundingClientRect();
    const size = Math.floor(bounds.width * window.devicePixelRatio) /
        window.devicePixelRatio;
    s.container.style.width = `${size}px`;
    s.container.style.height = `${size}px`;
    s.bounds.clear();
}
/**
 * Adds new number. It check if is readonly square
 * @param state
 * @returns
 */
export const addUserInput = (state) => (key) => (value) => {
    const { squares: userInput, readonlySquares } = state;
    if (readonlySquares.get(key) === "0") {
        userInput.set(key, value);
        state.lastMoves.push(key);
    }
    return userInput;
};
/**
 * This function add a new to the state.notes.
 * if the note is already in the list. It removes it, otherwise it adds it.
 * @param state
 * @returns
 */
export const addNote = (state) => (key) => (value) => {
    const values = state.notes.get(key) ?? new Set();
    if (!values.delete(value))
        values.add(value);
    if (values.size === 0)
        state.notes.delete(key);
    else
        state.notes.set(key, values);
    return state.notes;
};
export const removeAllNotes = (state) => (key) => {
    state.notes.set(key, new Set());
};
export const removingAllRelatedNotes = (state) => (key) => (value) => {
    const allRelatedKeys = getCommons(state)(key);
    // oxlint-disable-next-line no-unused-vars
    for (const [k, _] of allRelatedKeys) {
        const notes = state.notes.get(k);
        if (notes?.has(value)) {
            notes.delete(value);
        }
    }
};
export const getPositionFromBound = (state) => (p) => {
    const x = (state.bounds().width * p[0]) / BOARD_SIZE;
    const y = (state.bounds().height * p[1]) / BOARD_SIZE;
    return [x, y];
};
export const isEmptySquare = (state) => (k) => state.squares.get(k) === "0";
export const getElementByKey = (state) => (key) => {
    const { board } = state;
    let el = board.firstChild;
    while (el) {
        if (el.dataset.key?.startsWith(key)) {
            return el;
        }
        el = el.nextSibling;
    }
    return null;
};
export const getPositionKeyAtDom = (bounds) => (pos, xSize = 9, ySize = 9) => {
    const file = Math.floor((xSize * (pos[0] - bounds.left)) / bounds.width);
    const rank = Math.floor((ySize * (pos[1] - bounds.top)) / bounds.height);
    return file >= 0 && file < xSize && rank >= 0 && rank <= ySize
        ? [file, rank]
        : [-1, -1];
};
/**
 * returns related squares
 * @param state
 * @returns
 */
export const getCommons = (state) => (key, noZero = false) => new Map([
    ...getSquareRow(state)(key, noZero),
    ...getSquareColumn(state)(key, noZero),
    ...getSquareSquare(state)(key, noZero),
]);
export const getSquareNr = (n) => {
    const x = Math.ceil(n / 3);
    const y = ((n - 1) % 3) + 1;
    return [x, y];
};
export const getDuplicates = (state) => (f) => getKeys().forEach((key) => getDuplicateKeys(f(key, true)).forEach((k) => state.duplicates.set(k, `${state.squares.get(k)}`)));
export const setDuplicates = (state) => {
    state.duplicates.clear();
    getDuplicates(state)(getSquareRow(state));
    getDuplicates(state)(getSquareColumn(state));
    getDuplicates(state)(getSquareSquare(state));
    return state;
};
function getDuplicateKeys(squares) {
    const valueMap = new Map();
    const result = [];
    for (const [key, value] of squares.entries()) {
        if (!valueMap.has(value)) {
            valueMap.set(value, []);
        }
        valueMap.get(value).push(key);
    }
    for (const values of valueMap.values()) {
        if (values.length > 1) {
            result.push(...values);
        }
    }
    return result;
}
export const getSquareRow = (state) => (key, noZero = false) => getSquaresBy(state)(key, noZero)(0);
export const getSquareColumn = (state) => (key, noZero = false) => getSquaresBy(state)(key, noZero)(1);
export const getSquareSquare = (state) => (key, noZero = false) => getSquaresBy(state)(key, noZero)(2);
/**
 * A square represented by {File}{Rank}{Rank} e.g a11
 * a = row
 * 1  = column
 * 1 = square
 *
 * @param state
 * @returns
 */
export const getSquaresBy = (state) => (key, noZero = false) => (n) => {
    const s = new Map();
    for (const [k, v] of state.squares) {
        if (k[n] === key[n]) {
            if (noZero && v === "0")
                continue;
            s.set(k, v);
        }
    }
    return s;
};
export const createButtons = ({ buttons, classname, section, bounds, isFixedSized = false, hasId = false, width, height, }) => {
    for (const v of buttons) {
        const btn = createElement({
            tag: "button",
            classname: `${classname} btn-${v}`,
            id: hasId ? v : "",
        });
        btn.dataset.key = v;
        if (isFixedSized) {
            btn.style.height = `${bounds().height / BOARD_SIZE}px`;
            btn.style.width = `${bounds().width / BOARD_SIZE}px`;
        }
        if (width && height) {
            btn.style.height = `${height}px`;
            btn.style.width = `${width}px`;
        }
        const i = createElement({ tag: "i", classname: `icon-fonts icon-${v}` });
        btn.appendChild(i);
        section.append(btn);
    }
    return section;
};
//# sourceMappingURL=utils.js.map
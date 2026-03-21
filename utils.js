import { renderCells } from "./render";
import { files, ranks, TOTAL_FILE, buttons, } from "./types";
export const Box = (value) => ({
    map: (fn) => Box(fn(value)),
    fold: (fn) => fn(value),
    toString: () => {
        return value;
    },
});
export const keyToPosition = (k) => [
    k.charCodeAt(0) - 97,
    k.charCodeAt(1) - 49,
];
export const getKeys = () => {
    let i = 0;
    return files
        .map((f) => ranks.map((r) => {
        const row = Math.floor(i / 9);
        const col = i % 9;
        const block = Math.floor(row / 3) * 3 + Math.floor(col / 3) + 1;
        i++;
        return `${f}${r}${block}`;
    }))
        .flat();
};
function getDuplicateKeys(map) {
    const valueMap = new Map();
    for (const [key, value] of map.entries()) {
        if (!valueMap.has(value)) {
            valueMap.set(value, []);
        }
        valueMap.get(value).push(key);
    }
    const result = [];
    for (const keys of valueMap.values()) {
        if (keys.length > 1) {
            result.push(...keys);
        }
    }
    return result;
}
export const showDuplicate = (state) => (f) => getKeys()
    .map((key) => getDuplicateKeys(f(key, true))
    .map((r) => {
    if (r) {
        const value = state.cells.get(r);
        state.duplicates.set(r, `${value}`);
    }
    else {
        state.duplicates.delete(r);
    }
    return state.duplicates;
})
    .flat())
    .flat();
export const showAllDuplicates = (state) => {
    showDuplicate(state)(getRow(state));
    showDuplicate(state)(getColumn(state));
    showDuplicate(state)(getSquare(state));
};
export const addNew = (state, value) => {
    state.duplicates = new Map();
    if (!state.targetKey)
        return;
    state.selected.map((s) => {
        if (state.originCell.get(s) !== "0" && state.originCell.get(s))
            return;
        const notes = getNotesInHighlighted(state, s)(value);
        if (notes.length > 0)
            state.notes = state.notes.filter((e) => !notes.includes(e));
        state.cells.set(s, `${value}`);
        state.userInput.set(s, `${value}`);
        if (hasCompleted(state)) {
            state.gameState = "isOvered";
        }
    });
    state.highlight = getCommons(state)(state.targetKey);
    showAllDuplicates(state);
    renderCells(state);
};
export const positionToKey = (p) => {
    const keys = getKeys();
    return p.every((x) => x >= 0 && x <= 8) ? keys[9 * p[0] + p[1]] : undefined;
};
export function memo(f) {
    let v;
    const ret = () => {
        if (v === undefined)
            v = f();
        return v;
    };
    ret.clear = () => {
        v = undefined;
    };
    return ret;
}
/**
 * When new value is enter should give all the notes that are value in highlighted
 * @param state
 * @param key
 * @returns
 */
export const getNotesInHighlighted = (state, key) => (value) => {
    const commons = getCommons(state)(key);
    if (state.notes.length < 1)
        return [];
    const keys = [];
    state.notes
        .filter((note) => {
        return note.slice(-1) === value;
    })
        .map((k) => {
        const f = `${k.slice(0, 3)}`;
        for (const key of commons.keys()) {
            if (key.startsWith(f)) {
                keys.push(`${key}${value}`);
            }
        }
    });
    return keys;
};
export const getCellBy = (state) => (key, noZero = false) => (n) => {
    const s = new Map();
    for (const [k, v] of state.cells) {
        if (k[n] === key[n]) {
            if (noZero && v === "0")
                continue;
            s.set(k, v);
        }
    }
    return s;
};
export const getRow = (state) => (key, noZero = false) => getCellBy(state)(key, noZero)(0);
export const getColumn = (state) => (key, noZero = false) => getCellBy(state)(key, noZero)(1);
export const getSquare = (state) => (key, noZero = false) => getCellBy(state)(key, noZero)(2);
export const getCommons = (state) => (key, noZero = false) => new Map([
    ...getRow(state)(key, noZero),
    ...getColumn(state)(key, noZero),
    ...getSquare(state)(key, noZero),
]);
export const getPositionFromBound = (state, p) => {
    const x = (state.bounds().width * p[0]) / TOTAL_FILE;
    const y = (state.bounds().height * p[1]) / TOTAL_FILE;
    return [x, y];
};
export const getSquareNr = (n) => {
    const x = Math.ceil(n / 3);
    const y = ((n - 1) % 3) + 1;
    return [x, y];
};
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
export const createCellElement = (tagName) => (k, v, isReadOnly = false) => {
    const cellElem = document.createElement(tagName);
    cellElem.dataset.key = k;
    cellElem.dataset.value = v;
    cellElem.dataset.isReadOnly = `${isReadOnly}`;
};
export function getKeyFromPosition(pos) {
    const k = (9 * pos[0] + pos[1]);
    return pos.every((x) => x >= 0 && x <= 9) ? getKeys()[k] : undefined;
}
export const allDigits = files.map((f, i) => `${f}${i + 1}`);
export function getDigitFromPosition(pos) {
    const k = (pos[1] + pos[0]);
    return pos.every((x) => x >= 0 && x <= 9) ? allDigits[k] : undefined;
}
export const getPositionKeyAtDom = (bounds) => (pos, xSize = 9, ySize = 9) => {
    let file = Math.floor((xSize * (pos[0] - bounds.left)) / bounds.width);
    let rank = Math.floor((ySize * (pos[1] - bounds.top)) / bounds.height);
    return file >= 0 && file < xSize && rank >= 0 && rank <= ySize
        ? [file, rank]
        : [-1, -1];
};
export const id = (x) => x;
export const getButtonKeys = () => {
    const numberOfButtons = 6;
    const buttonKeys = getKeys().slice(0, numberOfButtons);
    const m = new Map();
    buttons.map((b, i) => {
        const k = buttonKeys[i];
        m.set(k, b);
    });
    return m;
};
export const hasCompleted = (state) => {
    const { userInput, solutions } = state;
    const keySolutions = solutions.keys();
    let result = false;
    for (const k of keySolutions) {
        if (userInput.get(k) === "0")
            return false;
        else
            result = true;
    }
    return result;
};
export const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    //https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
    const pad = (n) => n.toString().padStart(2, "0");
    return `${pad(minutes)}:${pad(seconds)}`;
};
//# sourceMappingURL=utils.js.map
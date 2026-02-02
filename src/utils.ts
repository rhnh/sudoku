import {
  files,
  ranks,
  TOTAL_FILE,
  TOTAL_RANK,
  type CellElement,
  type Cells,
  type Hint,
  type Key,
  type Memo,
  type MouchEvent,
  type Position,
  type HeadlessState,
  type Value,
  type State,
} from "./types";

export type Box<T> = {
  map: <U>(fn: (x: T) => U) => Box<U>;
  fold: <R>(fn: (x: T) => R) => R;
};

export const Box = <T>(value: T): Box<T> => ({
  map: (fn) => Box(fn(value)),
  fold: (fn) => fn(value),
});

export const keyToPosition = (k: Key): Position => [
  k.charCodeAt(0) - 97,
  k.charCodeAt(1) - 49,
];

export const keys = files
  .map((f) => ranks.map((r) => `${f}${r}${r}${r}` as Key))
  .flat();

export const getCells = (): Cells => {
  const cells: Cells = new Map();
  keys.map((k) => {
    cells.set(k as Key, "0");
  });

  cells.set("a111" as Key, "4");

  return cells;
};

export function memo<A>(f: () => A): Memo<A> {
  let v: A | undefined;
  const ret = (): A => {
    if (v === undefined) v = f();
    return v;
  };
  ret.clear = () => {
    v = undefined;
  };
  return ret;
}

export const initState = (): State => {
  const state = {
    gameState: "isInitialed",
    cells: getCells(),
    selected: [],
    digits: getDigits(),
    hints: [],
  } as unknown as HeadlessState as State;
  return state;
};

export const isHint = (k: Hint | Key): boolean => k.length <= 3;

export const getPositionFromBound = (state: State, p: Position): Position => {
  const x = (state.bounds().width * p[0]) / 9;
  const y = (state.bounds().height * p[1]) / 9;
  return [x, y];
};

export const hValueToPosition = (n: number) => {
  const x = Math.ceil(n / 3);
  const y = ((n - 1) % 3) + 1;
  return [x, y];
};

export const getElementByKey =
  (state: State) =>
  (key: Key): CellElement | null => {
    const { board } = state;
    let el = board.firstChild as CellElement;
    while (el) {
      if (el.dataset.key?.startsWith(key)) {
        return el;
      }
      el = el.nextSibling as CellElement;
    }
    return null;
  };

export const createCellElement =
  (tagName: keyof HTMLElementTagNameMap | "Cell" | "Hint") =>
  (k: Key, v: Value, isReadOnly = false) => {
    const cellElem = document.createElement(tagName);
    cellElem.dataset.key = k;
    cellElem.dataset.value = v;
    cellElem.dataset.isReadOnly = `${isReadOnly}`;
  };

export const eventPosition = (e: MouchEvent): Position | undefined => {
  if (e.clientX || e.clientX === 0) return [e.clientX, e.clientY!];
  if (e.targetTouches?.[0])
    return [e.targetTouches[0].clientX, e.targetTouches[0].clientY];
  return; // touchend has no position!
};
export function getKeyFromPosition(pos: Position): Key | undefined {
  const k = (9 * pos[0] + pos[1]) as number;
  return pos.every((x) => x >= 0 && x <= 9) ? keys[k] : undefined;
}
export const allDigits = files.map((f, i) => `${f}${i + 1}` as Key);

export function getDigitFromPosition(pos: Position): Key | undefined {
  const k = (pos[1] + pos[0]) as number;
  return pos.every((x) => x >= 0 && x <= 9) ? allDigits[k] : undefined;
}

export const getPositionKeyAtDom =
  (bounds: DOMRectReadOnly) =>
  (pos: Position, xSize = 9, ySize = 9): Position => {
    let file = Math.floor((xSize * (pos[0] - bounds.left)) / bounds.width);
    let rank = Math.floor((ySize * (pos[1] - bounds.top)) / bounds.height);
    return file >= 0 && file < xSize && rank >= 0 && rank <= ySize
      ? [file, rank]
      : [-1, -1];
  };

export const id = <T>(x: T) => x;
export function getDigits() {
  const m = new Map();
  allDigits.map((k, i) => {
    m.set(k, i + 1);
  });

  return m;
}

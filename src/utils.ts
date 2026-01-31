import {
  files,
  ranks,
  type CellElement,
  type Cells,
  type Hint,
  type Key,
  type Memo,
  type MouchEvent,
  type Position,
  type State,
  type Value,
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
  const container = document.getElementById("container")!;
  const bounds = memo(() => container.getBoundingClientRect());
  return {
    gameState: "isInitialed",
    cells: getCells(),
    container,
    board: document.createElement("board"),
    bounds,
    hints: [
      "a11",
      "a12",
      "a13",
      "a19",
      "a14",
      "a15",
      "a16",
      "a17",
      "a18",
      "a21",
    ],
  };
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
  return pos.every((x) => x >= 0 && x <= 7) ? keys[k] : undefined;
}

export function getKeyAtDomPos(
  pos: Position,
  bounds: DOMRectReadOnly
): Key | undefined {
  let file = Math.floor((9 * (pos[0] - bounds.left)) / bounds.width);
  let rank = 8 - Math.floor((9 * (pos[1] - bounds.top)) / bounds.height);
  return file >= 0 && file < 9 && rank >= 0 && rank < 9
    ? getKeyFromPosition([file, rank])
    : undefined;
}

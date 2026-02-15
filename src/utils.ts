import {
  files,
  ranks,
  type CellElement,
  type Cells,
  type Key,
  type Memo,
  type Position,
  type HeadlessState,
  type Value,
  type State,
  type Digits,
  type BaseKey,
  type Rank,
  TOTAL_FILE,
  type Buttons,
  buttons,
} from "./types"

export type Box<T> = {
  map: <U>(fn: (x: T) => U) => Box<U>
  fold: <R>(fn: (x: T) => R) => R
}

export const Box = <T>(value: T): Box<T> => ({
  map: (fn) => Box(fn(value)),
  fold: (fn) => fn(value),
})

export const keyToPosition = (k: Key): Position => [
  k.charCodeAt(0) - 97,
  k.charCodeAt(1) - 49,
]

export const keys = files
  .map((f) => ranks.map((r) => `${f}${r}${r}` as Key))
  .flat()

export const positionToKey = (p: Position): Key | undefined =>
  p.every((x) => x >= 0 && x <= 8) ? keys[9 * p[0] + p[1]] : undefined

export const getCells = (): Cells => {
  const cells: Cells = new Map()
  const sortedCells: Cells = new Map()
  keys.map((k) => {
    cells.set(k as Key, "0")
  })
  cells.set("a11", "3")
  cells.set("e11", "4")
  cells.set("f11", "9")
  cells.set("d22", "6")
  cells.set("g22", "5")
  cells.set("i22", "1")
  cells.set("a33", "7")
  cells.set("b33", "5")
  cells.set("c33", "2")
  cells.set("f33", "1")
  cells.set("c44", "1")
  cells.set("g44", "7")

  cells.set("a55", "5")
  cells.set("d55", "3")
  cells.set("e55", "9")
  cells.set("f55", "6")
  cells.set("c66", "8")
  cells.set("d66", "1")
  cells.set("e66", "5")
  cells.set("h66", "9")
  cells.set("i66", "6")

  cells.set("c77", "3")
  cells.set("e77", "1")
  cells.set("h77", "6")

  cells.set("c88", "4")
  cells.set("g88", "1")

  cells.set("e99", "2")
  cells.set("f99", "8")

  return cells
}

export function memo<A>(f: () => A): Memo<A> {
  let v: A | undefined
  const ret = (): A => {
    if (v === undefined) v = f()
    return v
  }
  ret.clear = () => {
    v = undefined
  }
  return ret
}

export const getCellBy = (state: State) => (key: Key) => (n: number) => {
  const s = new Map()
  for (const [k, v] of state.cells) {
    if (k[n] === key[n]) {
      s.set(k, v)
    }
  }
  return s
}
export const getRow = (state: State) => (key: Key) => getCellBy(state)(key)(0)

export const getColumn = (state: State) => (key: Key) =>
  getCellBy(state)(key)(1)

export const getSquare = (state: State) => (key: Key) =>
  getCellBy(state)(key)(2)

export const initState = (): State => {
  const headlessState: HeadlessState = {
    gameState: "isInitialed",
    cells: getCells(),
    selected: [],
    digits: getDigits(),
    hints: ["b11", "b12", "b13", "b14", "b15", "b16", "b17", "b18", "b19"],
    buttons: getButtonKeys(),
    isHint: true,
    isDragging: false,
    isHold: false,
  }
  return headlessState as unknown as State
}

export const getPositionFromBound = (state: State, p: Position): Position => {
  const x = (state.bounds().width * p[0]) / TOTAL_FILE
  const y = (state.bounds().height * p[1]) / TOTAL_FILE
  return [x, y]
}

export const getSquareNr = (n: number) => {
  const x = Math.ceil(n / 3)
  const y = ((n - 1) % 3) + 1
  return [x, y]
}

export const getElementByKey =
  (state: State) =>
  (key: Key): CellElement | null => {
    const {board} = state
    let el = board.firstChild as CellElement
    while (el) {
      if (el.dataset.key?.startsWith(key)) {
        return el
      }
      el = el.nextSibling as CellElement
    }
    return null
  }

export const createCellElement =
  (tagName: keyof HTMLElementTagNameMap | "Cell" | "Hint") =>
  (k: Key, v: Value, isReadOnly = false) => {
    const cellElem = document.createElement(tagName)
    cellElem.dataset.key = k
    cellElem.dataset.value = v
    cellElem.dataset.isReadOnly = `${isReadOnly}`
  }
export function getKeyFromPosition(pos: Position): Key | undefined {
  const k = (9 * pos[0] + pos[1]) as number
  return pos.every((x) => x >= 0 && x <= 9) ? keys[k] : undefined
}
export const allDigits = files.map((f, i) => `${f}${i + 1}` as Key)

export function getDigitFromPosition(pos: Position): Key | undefined {
  const k = (pos[1] + pos[0]) as number
  return pos.every((x) => x >= 0 && x <= 9) ? allDigits[k] : undefined
}

export const getPositionKeyAtDom =
  (bounds: DOMRectReadOnly) =>
  (pos: Position, xSize = 9, ySize = 9): Position => {
    let file = Math.floor((xSize * (pos[0] - bounds.left)) / bounds.width)
    let rank = Math.floor((ySize * (pos[1] - bounds.top)) / bounds.height)
    return file >= 0 && file < xSize && rank >= 0 && rank <= ySize
      ? [file, rank]
      : [-1, -1]
  }

export const id = <T>(x: T) => x

export function getDigits() {
  const m: Digits = new Map()
  allDigits.map((k, i) => {
    const key: BaseKey = k as unknown as BaseKey
    const value: Value = +(i + 1) as unknown as Rank
    m.set(key, value)
  })

  return m
}

export const getButtonKeys = () => {
  const buttonKeys = keys.slice(0, 3)
  const m: Buttons = new Map()
  buttons.map((b, i) => {
    const k: BaseKey = buttonKeys[i] as unknown as BaseKey
    m.set(k, b)
  })
  return m
}

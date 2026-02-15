import {sudokuGenerator} from "./sudoku"
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
export const getKeys = () => {
  let i = 0
  return files
    .map((f) =>
      ranks.map((r) => {
        const row = Math.floor(i / 9)
        const col = i % 9

        const block = Math.floor(row / 3) * 3 + Math.floor(col / 3) + 1
        i++
        return `${f}${r}${block}` as Key
      }),
    )
    .flat()
}

export const positionToKey = (p: Position): Key | undefined => {
  const keys = getKeys()
  return p.every((x) => x >= 0 && x <= 8) ? keys[9 * p[0] + p[1]] : undefined
}
export const getCells = (): Cells => {
  const cells: Cells = new Map()
  const s = sudokuGenerator(50).flat()

  getKeys().map((key, i) => {
    // Calculate square number (1–9)
    const row = Math.floor(i / 9)
    const col = i % 9

    const block = Math.floor(row / 3) * 3 + Math.floor(col / 3) + 1
    let k = key.replace(/.$/, `${block}`) as Key
    cells.set(k, `${s[i]}` as Value)
  })

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
  return pos.every((x) => x >= 0 && x <= 9) ? getKeys()[k] : undefined
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
  const buttonKeys = getKeys().slice(0, 3)
  const m: Buttons = new Map()
  buttons.map((b, i) => {
    const k: BaseKey = buttonKeys[i] as unknown as BaseKey
    m.set(k, b)
  })
  return m
}

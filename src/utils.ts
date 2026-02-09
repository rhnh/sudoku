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
  .map((f) => ranks.map((r) => `${f}${r}${r}${r}` as Key))
  .flat()

export const getCells = (): Cells => {
  const cells: Cells = new Map()
  keys.map((k) => {
    cells.set(k as Key, "0")
  })
  cells.set("a111", "3")
  cells.set("e111", "4")
  cells.set("f111", "9")
  cells.set("d222", "6")
  cells.set("g222", "5")
  cells.set("i222", "1")
  cells.set("a333", "7")
  cells.set("b333", "5")
  cells.set("c333", "2")
  cells.set("f333", "1")
  cells.set("c444", "1")
  cells.set("g444", "7")

  cells.set("a555", "5")
  cells.set("d555", "3")
  cells.set("e555", "9")
  cells.set("f555", "6")
  cells.set("c666", "8")
  cells.set("d666", "1")
  cells.set("e666", "5")
  cells.set("h666", "9")
  cells.set("i666", "6")

  cells.set("c777", "3")
  cells.set("e777", "1")
  cells.set("h777", "6")

  cells.set("c888", "4")
  cells.set("g888", "1")

  cells.set("e999", "2")
  cells.set("f999", "8")

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

export const getRow = (state: State) => (rowNumber: string) => {
  const res = new Map()
  const t = keys.filter((r) => {
    return r.startsWith(rowNumber)
  })
  return res
}

export const getColumn = (status: State) => (rowNumber: number) => {
  const t = keys.filter((k) => {
    const t = k.slice(1).startsWith(rowNumber.toString())
    // console.log(t, rowNumber, k.slice(1));
    return t
  })
}

export const initState = (): State => {
  const headlessState: HeadlessState = {
    gameState: "isInitialed",
    cells: getCells(),
    selected: [],
    digits: getDigits(),
    hints: ["b11", "b12", "b13", "b14", "b15", "b16", "b17", "b18", "b19"],
    buttons: getButtonKeys(),
    isHint: false,
    forceRerender: false,
  }
  return headlessState as unknown as State
}

export const getPositionFromBound = (state: State, p: Position): Position => {
  const x = (state.bounds().width * p[0]) / TOTAL_FILE
  const y = (state.bounds().height * p[1]) / TOTAL_FILE
  return [x, y]
}

export const hValueToPosition = (n: number) => {
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

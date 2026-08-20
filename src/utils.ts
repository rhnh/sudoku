import {files, ranks, TOTAL_FILE} from "./constants"
import {renderBoard} from "./render"
import {State} from "./state"
import {
  type CellElement,
  type Cells,
  type Key,
  type Position,
  type Value,
  type BaseKey,
  type Buttons,
  buttons,
  Note,
} from "./types"

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

function getDuplicateKeys(map: Cells): Key[] {
  const valueMap = new Map()
  const result: Key[] = []

  for (const [key, value] of map.entries()) {
    if (!valueMap.has(value)) {
      valueMap.set(value, [])
    }
    valueMap.get(value).push(key)
  }

  for (const values of valueMap.values()) {
    if (values.length > 1) {
      result.push(...values)
    }
  }

  return result
}

export const getDuplicates =
  (state: State) => (f: (key: Key, noZero: boolean) => Cells) =>
    getKeys()
      .map((key) =>
        getDuplicateKeys(f(key, true))
          .map((r) => {
            if (r) {
              const value = state.cells.get(r) as Value
              state.duplicates.set(r, `${value}`)
            } else {
              state.duplicates.delete(r)
            }
            return state.duplicates
          })
          .flat(),
      )
      .flat()

export const getAllDuplicates = (state: State) => {
  getDuplicates(state)(getRow(state))
  getDuplicates(state)(getColumn(state))
  getDuplicates(state)(getSquare(state))
}

export const addNewValue = (state: State, value: Value) => {
  state.duplicates = new Map()
  if (!state.targetKey) return
  state.selected.map((s) => {
    if (state.originCell.get(s) !== "0" && state.originCell.get(s)) return
    const notes = getNotesInHighlighted(state, s)(value)
    if (notes.length > 0)
      state.notes = state.notes.filter((e) => !notes.includes(e))

    state.cells.set(s, `${value}`)
    state.lastMoves.push(s)
    state.userInput.set(s, `${value}`)
    if (hasCompleted(state)) {
      state.gameState = "isOvered"
    }
  })

  state.highlight = getCommons(state)(state.targetKey)
  getAllDuplicates(state)
  renderBoard(state)
}

export const positionToKey = (p: Position): Key | undefined => {
  const keys = getKeys()
  return p.every((x) => x >= 0 && x <= 8) ? keys[9 * p[0] + p[1]] : undefined
}

/**
 * When new value is enter should give all the notes that are value in highlighted
 * @param state
 * @param key
 * @returns
 */
export const getNotesInHighlighted =
  (state: State, key: Key) =>
  (value: Value): Note[] => {
    const commons = getCommons(state)(key)

    if (state.notes.length < 1) return []

    const keys: Note[] = []
    state.notes
      .filter((note) => {
        return note.slice(-1) === value
      })
      .map((k) => {
        const f = `${k.slice(0, 3)}` as Key
        for (const key of commons.keys()) {
          if (key.startsWith(f)) {
            keys.push(`${key}${value}` as Key)
          }
        }
      })

    return keys
  }

export const getCellBy =
  (state: State) =>
  (key: Key, noZero = false) =>
  (n: number) => {
    const s = new Map()
    for (const [k, v] of state.cells) {
      if (k[n] === key[n]) {
        if (noZero && v === "0") continue
        s.set(k, v)
      }
    }
    return s
  }
export const getRow =
  (state: State) =>
  (key: Key, noZero = false): Cells =>
    getCellBy(state)(key, noZero)(0)

export const getColumn =
  (state: State) =>
  (key: Key, noZero = false): Cells =>
    getCellBy(state)(key, noZero)(1)

export const getSquare =
  (state: State) =>
  (key: Key, noZero = false) =>
    getCellBy(state)(key, noZero)(2)

/**
 * returns related squares
 * @param state
 * @returns
 */
export const getCommons =
  (state: State) =>
  (key: Key, noZero = false): Cells =>
    new Map([
      ...getRow(state)(key, noZero),
      ...getColumn(state)(key, noZero),
      ...getSquare(state)(key, noZero),
    ])

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
  (tagName: keyof HTMLElementTagNameMap | "Cell" | "Note") =>
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

export const getButtonKeys = () => {
  const numberOfButtons = 7
  const buttonKeys = getKeys().slice(0, numberOfButtons)
  const m: Buttons = new Map()
  buttons.map((b, i) => {
    const k: BaseKey = buttonKeys[i] as unknown as BaseKey
    m.set(k, b)
  })
  return m
}

export const hasCompleted = (state: State) => {
  const {userInput, solutions} = state
  const keySolutions = solutions.keys()
  let result = false
  for (const k of keySolutions) {
    if (userInput.get(k) === "0") return false
    else result = true
  }
  return result
}

export const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  //https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${pad(minutes)}:${pad(seconds)}`
}
/**
 * https://www.typescriptlang.org/docs/handbook/dom-manipulation.html
 * @param SVGElementTagNameMap
 * @returns - a SVG
 */

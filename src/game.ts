import {sudokuGenerator} from "./sudoku.temp"
import type {
  BaseKey,
  Cells,
  Digits,
  HeadlessState,
  Key,
  Rank,
  State,
  Value,
} from "./types"
import {allDigits, getButtonKeys, getKeys} from "./utils"

export function getDigits() {
  const m: Digits = new Map()
  allDigits.map((k, i) => {
    const key: BaseKey = k as unknown as BaseKey
    const value: Value = +(i + 1) as unknown as Rank
    m.set(key, value)
  })

  return m
}

export const initState = (): State => {
  const headlessState: HeadlessState = {
    gameState: "isInitialed",
    cells: getCells(),
    selected: [],
    digits: getDigits(),
    hints: [],
    buttons: getButtonKeys(),
    isHint: false,
    isDragging: false,
    isHold: false,
    highlight: new Map(),
    duplicates: new Map(),
  }
  return headlessState as unknown as State
}
export const getCells = (): Cells => {
  const cells: Cells = new Map()
  const s = sudokuGenerator(60).flat()

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

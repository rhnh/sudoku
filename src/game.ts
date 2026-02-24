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
  const originalCells = getCells()
  const cells = new Map([...originalCells.cells])
  const userInput = new Map()
  const userInputKeys = [...originalCells.solutions.keys()]
  userInputKeys.map((r) => userInput.set(r, "0"))

  const headlessState: HeadlessState = {
    gameState: "isInitialed",
    cells: cells,
    originCell: originalCells.cells,
    selected: [],
    digits: getDigits(),
    notes: [],
    buttons: getButtonKeys(),
    isNote: false,
    isDragging: false,
    isHold: false,
    highlight: new Map(),
    duplicates: new Map(),
    solutions: originalCells.solutions,
    userInput, //TODO: After every click it should scan if this not empty and if it filled and has the correct answers
    seconds: 0,
  }
  return headlessState as unknown as State
}
export const getCells = (): {cells: Cells; solutions: Map<Key, Value>} => {
  const cells: Cells = new Map()
  const sudokuGenerated = sudokuGenerator(50)
  const sudoku = sudokuGenerated.grid.flat()
  const solutions = sudokuGenerated.removed

  getKeys().map((key, i) => {
    // Calculate square number (1–9)
    const row = Math.floor(i / 9)
    const col = i % 9

    const block = Math.floor(row / 3) * 3 + Math.floor(col / 3) + 1
    let k = key.replace(/.$/, `${block}`) as Key
    cells.set(k, `${sudoku[i]}` as Value)
  })

  return {cells, solutions}
}

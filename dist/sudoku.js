import {events, keyEvents} from "./events"
import {render, renderBase} from "./render"
import {sudokuGenerator} from "./sudoku.temp"
import {allDigits, Box, getButtonKeys, getKeys} from "./utils"
export function getDigits() {
  const m = new Map()
  allDigits.map((k, i) => {
    const key = k
    const value = +(i + 1)
    m.set(key, value)
  })
  return m
}
export const initState = (el, sudoku) => {
  const originalCells = getCells()
  const cells = new Map([...originalCells.cells])
  const userInput = new Map()
  const userInputKeys = [...originalCells.solutions.keys()]
  userInputKeys.map((r) => userInput.set(r, "0"))
  const headlessState = {
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
  const state = {...headlessState, wrap: el}
  return state
}
export const getCells = () => {
  const cells = new Map()
  const sudokuGenerated = sudokuGenerator(35)
  const sudoku = sudokuGenerated.grid.flat()
  const solutions = sudokuGenerated.solution
  getKeys().map((key, i) => {
    // Calculate square number (1–9)
    const row = Math.floor(i / 9)
    const col = i % 9
    const block = Math.floor(row / 3) * 3 + Math.floor(col / 3) + 1
    let k = key.replace(/.$/, `${block}`)
    cells.set(k, `${sudoku[i]}`)
  })
  return {cells, solutions}
}
export function Sudoku(e, sudoku) {
  return Box(initState(e, sudoku))
    .map(renderBase)
    .map(render)
    .map(events)
    .map(keyEvents)
}
//# sourceMappingURL=sudoku.js.map

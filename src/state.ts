import {Memo} from "./lib"
import {
  Buttons,
  Cells,
  Digits,
  GameState,
  Key,
  Notes,
  Rank,
  Value,
} from "./types"

export interface HeadlessState {
  gameState: GameState
  cells: Cells
  originCell: Cells
  notes: Notes
  digits: Digits
  selected: Key[]
  buttons: Buttons
  isNote: boolean
  draggingValue?: Rank
  isDragging: boolean
  isHold: boolean
  highlight: Cells
  duplicates: Cells
  targetKey?: Key
  solutions: Cells
  userInput: Cells
  seconds: number
  lastMoves: Key[]
}

export interface State extends HeadlessState {
  addDimensionsCssVarsTo: any
  wrap: HTMLElement
  board: HTMLElement
  container: HTMLElement
  bounds: Memo<DOMRectReadOnly>
  numpadSection: HTMLElement
  sidePanel: HTMLElement
  ctrlBTNSection: HTMLElement
  draggingElement?: HTMLElement
}

export interface CellElement extends HTMLElement {
  key: Key
  value: Value
  isReadOnly: boolean
}

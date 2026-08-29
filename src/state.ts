import type {Memo} from "./lib"

import type {
  Buttons,
  Squares,
  Digits,
  GameState,
  Key,
  Notes,
  Value,
} from "./types"

export interface HeadlessState {
  gameState: GameState
  cells: Squares
  originCell: Squares
  notes: Notes
  digits: Digits
  selected: Key[]
  buttons: Buttons
  isNote: boolean
  draggingValue?: Value
  isDragging: boolean
  isHold: boolean
  highlight: Squares
  duplicates: Squares
  targetKey?: Key
  solutions: Squares
  userInput: Squares
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
  rerender: (state: State) => State
}

export interface TypeCellElement extends HTMLElement {
  key: Key
  value: Value
  isReadOnly: boolean
}

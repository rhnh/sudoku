import {BTN_NAMES, FILES, GAME_STATE, RANKS} from "./constants"

export type File = (typeof FILES)[number]
export type Rank = (typeof RANKS)[number] | "0"
export type Position = [number, number]
export type BaseKey = `${File}${Rank}`
export type MouchEvent = MouseEvent | TouchEvent

export type ButtonTexts = (typeof BTN_NAMES)[number]

export type Buttons = Map<BaseKey, ButtonTexts>
export type Note = `${BaseKey}${Rank}`
export type Notes = Note[]
export type Key = `${BaseKey}${Rank}`

export type GameState = (typeof GAME_STATE)[number]

export type Value = Rank

export type Cells = Map<Key, Value>

export interface Memo<A> {
  (): A
  clear: () => void
}
export type Digits = Map<BaseKey, Value>

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
  numPad: HTMLElement
  aside: HTMLElement
  bounds: Memo<DOMRectReadOnly>
  nav: HTMLElement
  draggingElement?: HTMLElement
}

export interface CellElement extends HTMLElement {
  key: Key
  value: Value
  isReadOnly: boolean
}

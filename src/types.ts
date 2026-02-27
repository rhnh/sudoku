export const TOTAL_FILE = 9
export const TOTAL_RANK = TOTAL_FILE
export const ranks = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const
export const files = ["a", "b", "c", "d", "e", "f", "g", "h", "i"] as const

export type File = (typeof files)[number]
export type Rank = (typeof ranks)[number] | "0"
export type Position = [number, number]
export type BaseKey = `${File}${Rank}`

export const buttons = [
  "start",
  "restart",
  "remove",
  "note",
  "hint",
  "timer",
] as const
export type ButtonTexts = (typeof buttons)[number]

export type Buttons = Map<BaseKey, ButtonTexts>
export type Note = `${BaseKey}${Rank}`
export type Notes = Note[]
export type Key = `${BaseKey}${Rank}`

export type GameState = "isInitialed" | "isPaused" | "isPlaying" | "isOvered"

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

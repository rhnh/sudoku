import {Memo} from "./lib"
import {HeadlessState} from "./types"

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

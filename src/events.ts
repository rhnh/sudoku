import {fill, render} from "./render"
import type {BaseKey, CellElement, Rank, State, Value} from "./types"
import {
  getPositionKeyAtDom,
  getKeyFromPosition,
  getDigitFromPosition,
  getElementByKey,
} from "./utils"

export const events = (state: State): State => {
  const {board} = state
  board.addEventListener("pointerdown", pointerDown(state))
  board.addEventListener("drag", pointerMove(state))
  board.addEventListener("pointerup", pointerUp(state))
}
export const pointerUp = (state: State) => (e: MouseEvent) => {}
export const pointerMove = (state: State) => (e: MouseEvent) => {
  const {clientX: x, clientY: y} = e

  if (!state.draggingElement || !state.isDraggable) return
  const p = state.draggingElement?.querySelector(
    ".main-value",
  ) as unknown as HTMLParagraphElement
  console.log(p)
  p.style.position = "absolute"
  p.style.transform = `translate(${
    x -
    state.draggingElement?.getBoundingClientRect().left -
    state.draggingElement?.getBoundingClientRect().width / 3
  }px, ${y - state.draggingElement?.getBoundingClientRect().top - state.draggingElement?.getBoundingClientRect().height / 3}px)`
}
export const pointerDown = (state: State) => (e: MouseEvent) => {
  const {clientX: x, clientY: y} = e
  console.log(state.isDraggable, state.draggingElement, state.forceRerender)

  const {bounds} = state
  const pos = getPositionKeyAtDom(bounds())([x, y])
  const key = getKeyFromPosition(pos)
  if (!key) return
  state.startX = e.pageX
  state.startY = e.pageY
  let selected
  if (e.ctrlKey) {
    selected = new Set([...state.selected, key])
  } else {
    state.isSelected = true
    selected = new Set([key])
  }
  state.selected = [...selected]
  state.selected.map((selected) => {
    const found = state.cells.get(selected)
    if (found !== "0") {
      const el = getElementByKey(state)(key) as unknown as CellElement
      if (!el) return
      state.draggingElement = el
      state.draggingValue = el.innerText as Rank
      state.isDraggable = true
      state.forceRerender = false
    }
  })
}

export const numPadEvents = (state: State): State => {
  const {numPad} = state

  numPad.addEventListener("pointerdown", (e) => {
    const {clientX: x, clientY: y} = e
    const position = getPositionKeyAtDom(numPad.getBoundingClientRect())(
      [x, y],
      9,
      1,
    )
    const numKey = getDigitFromPosition(position) as unknown as BaseKey
    let value = state.digits.get(numKey) as unknown as Rank
    fill(state, value)
  })
  return state
}

export function panelEvent(state: State): State {
  return state
}
export function keyEvents(state: State): State {
  document.addEventListener("keydown", (e) => {
    const value: Value = e.key as Value
    const regex = value.match(/\d/)
    if (regex) {
      fill(state, value)
    }
    if (e.key === "h") {
      state.isHint = !state.isHint
    }
  })
  return state
}

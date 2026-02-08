import {renderCells} from "./render"
import type {BaseKey, Hint, Key, Rank, State, Value} from "./types"
import {
  getPositionKeyAtDom,
  getKeyFromPosition,
  getDigitFromPosition,
  getRow,
  getColumn,
  getElementByKey,
} from "./utils"

export const events = (state: State): State => {
  const {board} = state
  board.addEventListener("pointerdown", (e) => {
    const {clientX: x, clientY: y} = e
    const t = getPositionKeyAtDom(state.bounds())([x, y])
    const key = getKeyFromPosition(t) as unknown as Key

    if (state.selected.find((k) => k === key)) {
      state.selected = [key]
      renderCells(state)
      return state
    }

    if (e.ctrlKey) {
      state.selected.push(key)
      renderCells(state)
      return state
    } else {
      state.selected = [key]
      renderCells(state)
      return state
    }
  })

  return state
}

export const numPadEvents = (state: State): State => {
  const {numPad} = state

  numPad.addEventListener("pointerdown", (e) => {
    const {clientX: x, clientY: y} = e
    const t = getPositionKeyAtDom(numPad.getBoundingClientRect())([x, y], 9, 1)
    const key = getDigitFromPosition(t) as unknown as BaseKey

    const value = state.digits.get(key) as unknown as Rank
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
  })
  return state
}

export function fill(state: State, value: Value) {
  if (state.isHint) {
    state.selected.map((s) => {
      const hint = `${s.slice(0, 2)}${value}` as unknown as Hint
      //check if already exist.
      const alreadyHint = state.hints.filter((h) => h === hint)
      if (alreadyHint.length > 0) {
        state.hints = state.hints.filter((i) => i !== hint)
        state.selected = []
        renderCells(state)
        return
      } else {
        state.hints.push(hint)
        state.selected = []
      }
    })
    renderCells(state)
  } else {
    state.selected.map((selectedKey) => {
      state.cells.set(selectedKey, value)
    })
    renderCells(state)
    state.selected = []
  }
}

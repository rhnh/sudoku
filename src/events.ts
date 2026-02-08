import {renderCells} from "./render"
import type {BaseKey, CellElement, Hint, Key, Rank, State, Value} from "./types"
import {
  getPositionKeyAtDom,
  getKeyFromPosition,
  getDigitFromPosition,
  getElementByKey,
} from "./utils"

export const events = (state: State): State => {
  const {board} = state
  board.addEventListener("pointerdown", (e) => {
    const {clientX: x, clientY: y} = e
    const t = getPositionKeyAtDom(state.bounds())([x, y])
    const key = getKeyFromPosition(t) as unknown as Key
    board.querySelector(".selected")?.classList.remove("selected")

    if (state.selected.find((k) => k === key)) {
      state.selected = [key]
      state.forceRerender = false
    }
    const el = getElementByKey(state)(key) as unknown as CellElement

    state.draggingElement = el
    el.classList.add("selected")
    state.draggingValue = el.innerText as Rank

    if (state.selected.find((k) => k === key)) {
      state.selected = [key]
    }

    if (e.ctrlKey) {
      state.selected.push(key)
    } else {
      state.selected = [key]
    }
  })

  board.addEventListener("pointermove", (e) => {
    const {clientX: x, clientY: y} = e
    const p = state.draggingElement?.firstChild as unknown as HTMLElement
    const isHint = p && p.innerText === ""

    if (isHint) {
      p.style.transform = "unset"
      return
    }

    if (state.draggingElement && p) {
      p.style.transform = `translate(${
        x -
        state.draggingElement?.getBoundingClientRect().left -
        state.draggingElement?.getBoundingClientRect().width / 3
      }px, ${y - state.draggingElement?.getBoundingClientRect().top - state.draggingElement?.getBoundingClientRect().height / 3}px)`
    }
  })

  board.addEventListener("pointerup", (e) => {
    const {clientX: x, clientY: y} = e
    if (state.isHint) return
    const t = getPositionKeyAtDom(state.bounds())([x, y])
    const key = getKeyFromPosition(t) as unknown as Key
    const p = state.draggingElement?.firstChild as unknown as HTMLElement
    const isHint = p && p.innerText === ""
    if (isHint) {
      state.draggingElement = undefined
      state.draggingValue = undefined
      state.isHold = false
      p.style.transform = "unset"
      return
    }

    p.style.transform = "unset"

    if (state.draggingValue) state.cells.set(key, state.draggingValue! as Value)

    state.draggingElement = undefined
    state.draggingValue = undefined
    state.isHold = false
    renderCells(state)
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
    if (e.key === "h") {
      state.isHint = !state.isHint
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
        return state
      } else {
        state.hints.push(hint)
        return state
      }
    })
  } else {
    state.selected.map((selectedKey) => {
      state.cells.set(selectedKey, value)
      return state
    })
  }
  renderCells(state)
}

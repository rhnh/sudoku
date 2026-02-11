import {fill, renderCells} from "./render"
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
    const position = getPositionKeyAtDom(state.bounds())([x, y])
    const key = getKeyFromPosition(position) as unknown as Key
    console.log(state.selected)

    if (state.isSelected)
      state.board.querySelectorAll(".selected")?.forEach((item) => {
        item.classList.remove("selected")
      })
    if (e.ctrlKey) {
      state.isHint = true
      state.originKeys.push(key)
    } else {
      state.originKeys = [key]
      state.board.querySelectorAll(".selected")?.forEach((item) => {
        item.classList.remove("selected")
      })
    }
    if (state.selected.find((k) => k === key)) {
      state.selected = [key]
      state.forceRerender = false
    }
    const el = getElementByKey(state)(key) as unknown as CellElement
    if (!el) return
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
    const t = getPositionKeyAtDom(state.bounds())([x, y])
    let key = getKeyFromPosition(t) as unknown as Key | undefined

    const p = state.draggingElement?.firstChild as unknown as HTMLElement
    if (!key || !state.originKeys) return

    if (state.isHint) {
      if (!state.draggingValue || !state.originKeys) return

      state.originKeys.map((originKey) => {
        //Take first 2 chars of target to get Cell position.
        const firstChar = key.substring(0, 2)
        //get last 2 chars of origin to determine Hint position

        const lastCharOfTargetKey = originKey.substring(1)

        const selected = (firstChar + lastCharOfTargetKey) as Key

        state.selected.push(selected)
        if (!state.draggingValue) return
        fill(state, state.draggingValue)
      })
      return
    }

    p.style.transform = "unset"
    if (state.draggingElement?.childElementCount === 1)
      if (state.draggingValue)
        state.cells.set(key, state.draggingValue! as Value)

    state.draggingElement = undefined
    state.draggingValue = undefined
    state.originKeys = []
    renderCells(state)
  })
  return state
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

    if (state.isHint) {
      state.originKeys?.map((originKey) => {
        const key = originKey.slice(0, 2)

        const found = state.hints.find((r) => r === `${key}${value}`)

        if (found) {
          state.hints = state.hints.filter((r) => r !== found)
          return state
        } else {
          state.hints.push(`${key}${value}` as Hint)
        }
      })
    } else {
      state.selected.map((selectedKey) => {
        state.cells.set(selectedKey, value)
        return state
      })
    }
    renderCells(state)
  })
  numPad.addEventListener("drag", (e) => {
    return
  })
  numPad.addEventListener("pointerup", (e) => {})
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

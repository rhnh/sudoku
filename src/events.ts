import {fill, renderCells} from "./render"
import type {BaseKey, CellElement, Hint, Key, Rank, State, Value} from "./types"
import {
  getPositionKeyAtDom,
  getKeyFromPosition,
  getDigitFromPosition,
  getElementByKey,
  getCommons,
  setSelected,
} from "./utils"

export const events = (state: State): State => {
  const {board} = state
  board.addEventListener("pointerdown", (e) => {
    const {clientX: x, clientY: y} = e
    const position = getPositionKeyAtDom(state.bounds())([x, y])
    const key = getKeyFromPosition(position) as unknown as Key
    if (!key) return

    state.highlight = getCommons(state)(key)
    const el = getElementByKey(state)(key) as unknown as CellElement
    if (!el) return
    if (el.dataset.value === "0") {
      //don't drag this square
      if (e.ctrlKey) {
        state.selected = [...new Set(state.selected), key]
      } else {
        state.selected = [key]
      }
      state.isHold = true
      renderCells(state)
    } else {
      state.isDragging = true
      state.draggingElement = el
      state.selected = [key]
      state.draggingElement.classList.add("selected")
      const value = state.draggingElement.dataset.value
      if (!value) return
      state.draggingValue = value as unknown as Rank
    }
  })
  board.addEventListener("pointerup", (e) => {
    const {clientX: x, clientY: y} = e

    state.isHold = false
    const t = getPositionKeyAtDom(state.bounds())([x, y])
    let key = getKeyFromPosition(t) as unknown as Key | undefined
    if (!key) return
    if (state.isDragging && state.draggingElement) {
      const p = state.draggingElement?.firstChild as unknown as HTMLElement
      if (state.draggingElement && p) {
        p.style.position = "unset"
        p.style.transform = "unset"
      }
      state.draggingElement.classList.remove("selected")
      board
        .querySelectorAll(".selected")
        .forEach((s) => s.classList.remove("selected"))
      const value = state.draggingValue as unknown as Rank

      if (state.isHint) {
        const hintKey = `${key.slice(0, 2)}${value}` as unknown as Hint
        const found = state.hints.find((h) => hintKey === h)
        if (found) {
          state.hints = [...new Set(state.hints.filter((r) => r !== hintKey))]
        } else state.hints = [...new Set(state.hints), hintKey]
      } else {
        state.cells.set(key, value)
        state.highlight = getCommons(state)(key)
        for (const [kh, vh] of state.highlight) {
          if (vh === value && kh !== key) {
            state.duplicates.set(key, vh)
            state.duplicates.set(kh, vh)
          }
        }
      }
    }
    state.draggingElement = undefined
    state.isDragging = false
    state.draggingValue = undefined
    renderCells(state)
  })
  board.addEventListener("pointermove", (e) => {
    const {clientX: x, clientY: y} = e
    if (state.isHold) {
      const t = getPositionKeyAtDom(state.bounds())([x, y])
      let key = getKeyFromPosition(t) as unknown as Key | undefined
      if (!key) return
      state.selected = [...new Set(state.selected), key]
      state.selected = [...new Set(state.selected)]
      renderCells(state)
    }

    if (state.isDragging) {
      const p = state.draggingElement?.firstChild as unknown as HTMLElement
      if (state.draggingElement && p) {
        p.style.position = "absolute"
        p.style.transform = `translate(${
          x -
          state.draggingElement?.getBoundingClientRect().left -
          state.draggingElement?.getBoundingClientRect().width / 3
        }px, ${y - state.draggingElement?.getBoundingClientRect().top - state.draggingElement?.getBoundingClientRect().height / 3}px)`
      }
    }
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
    let value = state.digits.get(numKey) as unknown as Value
    if (state.isHint) {
      state.selected?.map((originKey) => {
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
      setSelected(state, value)
    }
    renderCells(state)
  })
  return state
}
// export const asideEvents = (state: State) => {
//   const {aside} = state
//   aside.firstChild.addEventListener("pointerdown", () => {
//     state.isHint == !state.isHint
//   })
//   return state
// }
export function panelEvent(state: State): State {
  return state
}
export function keyEvents(state: State): State {
  document.addEventListener("keydown", (e) => {
    const value: Value = e.key as Value
    const regex = value.match(/\d/)
    if (regex) {
      setSelected(state, value)
    }
    if (e.key === "h") {
      state.isHint = !state.isHint
    }

    renderCells(state)
  })
  return state
}

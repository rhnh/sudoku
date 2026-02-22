import {renderCells} from "./render"
import type {BaseKey, CellElement, Hint, Key, Rank, State, Value} from "./types"
import {
  getPositionKeyAtDom,
  getKeyFromPosition,
  getDigitFromPosition,
  getElementByKey,
  getCommons,
  addNew,
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
    state.targetKey = key
    state.selected.push(key)
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
        } else {
          state.selected.map((r) => {
            const hint = (r.slice(0, 2) + value) as unknown as Hint
            state.hints = [...new Set([...state.hints, hint])]
          })
        }
      } else {
        addNew(state, value)
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
    if (!value) return
    if (state.isHint) addHint(state)(value)
    else addNew(state, value)
    renderCells(state)
  })
  return state
}
export const addHint = (state: State) => (value: Value) => {
  const hints = state.selected?.map((k) => `${k.slice(0, 2)}${value}` as Hint)
  const f = new Set([...hints])
  const found = state.hints.filter((r) => f.has(r))
  if (found.length > 0) {
    state.hints = state.hints.filter((r) => !f.has(r))
    return
  }
  state.hints = [...new Set([...state.hints, ...hints])]
  state.hints = [...new Set([...state.hints])]
  state.hints = [
    ...state.hints,
    ...new Set(hints.filter((h, i) => state.hints[i] == h)),
  ]
}

export function keyEvents(state: State): State {
  document.addEventListener("keydown", (e) => {
    const value: Value = e.key[0] as Value
    const regex = value.match(/\d/)
    if (regex) {
      if (state.isHint) {
        if (!state.targetKey) return
        const hintKey =
          `${state.targetKey.slice(0, 2)}${value}` as unknown as Hint
        const found = state.hints.find((h) => hintKey === h)
        if (found) {
          state.hints = [...new Set(state.hints.filter((r) => r !== hintKey))]
        } else {
          state.selected.map((r) => {
            const hint = (r.slice(0, 2) + value) as unknown as Hint
            state.hints = [...new Set([...state.hints, hint])]
          })
        }
      } else addNew(state, `${value}`)
    }
    if (e.key === "h") {
      state.isHint = !state.isHint
    }

    renderCells(state)
  })
  return state
}

export function panelEvents(state: State) {
  const {panel} = state
  const reset = panel.querySelector("#restart") as HTMLButtonElement
  reset.addEventListener("pointerdown", () => {
    document.location.reload()
  })

  const hint = panel.querySelector("#hint") as HTMLButtonElement

  hint.addEventListener("pointerdown", () => {
    state.isHint = !state.isHint
    if (state.isHint) {
      hint.classList.add("btn-pressed")
    } else {
      hint.classList.remove("btn-pressed")
    }
  })

  const remove = panel.querySelector("#remove") as HTMLButtonElement
  remove.addEventListener("pointerdown", () => {
    if (!state.isHint)
      state.selected.map((r) => {
        if (state.originCell.get(r)) {
        } else {
          state.cells.set(r, "0")
        }
      })

    const found = state.selected
      .map((r) => state.hints.filter((h) => r.slice(0, 2) === h.slice(0, 2)))
      .flat() as unknown as Hint[]

    state.hints = state.hints.filter((item) => !found.includes(item))

    renderCells(state)
  })

  return state
}

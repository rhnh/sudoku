import {BOARD_SIZE} from "./constants"
import type {State, TypeCellElement} from "./state"
import type {Rank, Value} from "./types"
import {getElementByKey, getSquareNr} from "./utils"

export const addNote = (state: State) => (value: Value) => {
  state.selected.forEach((selectedKey) => {
    const preSet = state.notes.get(selectedKey)

    if (preSet && preSet.size) {
      if (preSet?.has(value)) {
        preSet.delete(value)
        state.notes.set(selectedKey, preSet)
      } else {
        if (state.cells.get(selectedKey) !== "0") return
        preSet.add(value)
        state.notes.set(selectedKey, preSet)
      }
    } else {
      if (state.cells.get(selectedKey) !== "0") return
      const set = new Set<Rank>([value])

      state.notes.set(selectedKey, set)
    }
  })
}

export function renderNotes(state: State): State {
  const {notes, bounds} = state
  const cellHeight = bounds().width / BOARD_SIZE
  const rows = 3 // in one Cell there will be 3 rows
  for (const [key, values] of notes) {
    const el = getElementByKey(state)(key)
    for (const value of values) {
      const [x, y] = getSquareNr(Number(value))
      const noteElm = document.createElement("note") as TypeCellElement
      noteElm.style.gridColumn = `${y}`
      noteElm.style.gridRow = `${x}`
      noteElm.innerHTML = `${value}`
      noteElm.style.fontSize = `${cellHeight / rows}px`
      noteElm.style.display = "flex"
      noteElm.style.alignItems = "center"
      noteElm.style.justifyContent = "center"
      noteElm.style.lineHeight = "1"
      el?.appendChild(noteElm)
    }
  }

  return state
}

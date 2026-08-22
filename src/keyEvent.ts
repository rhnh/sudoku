import {addNote} from "./notes"
import {renderBoard} from "./render"
import {State, Value} from "./types"
import {addNewValue} from "./utils"

export function keyEvents(state: State): State {
  const {nav} = state

  document.addEventListener("keydown", (e) => {
    if (e.key === "r") {
      document.location.reload()
    }
    if (state.gameState === "isInitialed") {
      if (e.key === "s") {
        state.gameState = "isPlaying"
        renderBoard(state)
      }
    }

    if (state.gameState === "isPlaying") {
      if (e.key === "n") {
        state.isNote = !state.isNote
        const note = nav.querySelector("#note") as HTMLButtonElement
        if (state.isNote) {
          note.classList.add("btn-pressed")
        } else {
          note.classList.remove("btn-pressed")
        }
      }
    }
    const value: Value = e.key[0] as Value

    const regex = value.match(/\d/)
    if (regex) {
      if (state.isNote) {
        if (!state.targetKey) return
        addNote(state)(value)
      } else addNewValue(state, `${value}`)
    }

    renderBoard(state)
  })
  return state
}

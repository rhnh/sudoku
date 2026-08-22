import {renderBoard} from "./render"
import {State, Value} from "./types"
import {addNewValue} from "./utils"
/**
 * This looks ameature. This need to change and should be saved in a map or an array
 * @param state
 * @returns
 */
export function panelEvents(state: State) {
  const {nav} = state

  const start = nav.querySelector("#start") as HTMLButtonElement
  if (!start) return state
  start.addEventListener("pointerdown", () => {
    if (state.gameState === "isInitialed") {
      state.gameState = "isPlaying"
      let btn = nav.querySelector("#start") as HTMLButtonElement
      btn.innerHTML = `<i class="fa-solid fa-circle-pause"></i>`
      renderBoard(state)
    } else if (state.gameState === "isPaused") {
      state.gameState = "isPlaying"
      let btn = nav.querySelector("#start") as HTMLButtonElement
      btn.innerHTML = `<i class="fa-solid fa-circle-pause"></i>`
      renderBoard(state)
    } else if (state.gameState === "isPlaying") {
      state.gameState = "isPaused"
      let btn = nav.querySelector("#start") as HTMLButtonElement

      btn.innerHTML = `<i class="fa-solid fa-forward"></i>`
      renderBoard(state)
    }
    renderBoard(state)
  })

  const restart = nav.querySelector("#restart") as HTMLButtonElement
  restart.addEventListener("pointerdown", () => {
    document.location.reload()
  })

  const note = nav.querySelector("#note") as HTMLButtonElement

  note.addEventListener("pointerdown", () => {
    state.isNote = !state.isNote
    if (state.isNote) {
      note.classList.add("btn-pressed")
    } else {
      note.classList.remove("btn-pressed")
    }
  })

  const remove = nav.querySelector("#remove") as HTMLButtonElement
  remove.addEventListener("pointerdown", () => {
    if (!state.isNote)
      state.selected.map((r) => {
        if (state.originCell.get(r) !== "0") {
        } else {
          state.cells.set(r, "0")
          state.duplicates = new Map()
        }
      })

    renderBoard(state)
  })

  const showHint = nav.querySelector("#hint") as HTMLButtonElement
  showHint.addEventListener("pointerdown", () => {
    if (state.gameState === "isPlaying") {
      const selected = state.selected
      selected.map((s) => {
        const value = state.solutions.get(s) as unknown as Value
        addNewValue(state, value)
      })
    }
  })
  const showUndo = nav.querySelector("#undo") as HTMLButtonElement
  showUndo.addEventListener("pointerdown", () => {
    if (state.gameState === "isPlaying" && state.lastMoves.length > 0) {
      const last = state.lastMoves.length - 1
      state.originCell.set(state.lastMoves[last], "0")
      state.cells.set(state.lastMoves[last], "0")

      state.lastMoves = state.lastMoves.filter(
        (r) => r != state.lastMoves[last],
      )
      state.duplicates.clear()
      renderBoard(state)
    }
  })

  const timer = nav.querySelector("#timer") as HTMLElement
  if (timer) {
    timer.addEventListener("pointerdown", () => {
      const timerText = timer.firstChild as HTMLElement
      timerText.classList.toggle("hide")
    })
  }
  return state
}

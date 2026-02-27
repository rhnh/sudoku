import {addNote, renderCells} from "./render"
import type {CellElement, Note, Key, Rank, State, Value} from "./types"
import {
  getPositionKeyAtDom,
  getKeyFromPosition,
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
        state.selected = [...new Set([key])]
      }
      state.isHold = true
      renderCells(state)
    } else {
      state.isDragging = true
      state.draggingElement = el
      state.selected = state.selected = [...new Set([key])]
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
    state.selected = [...new Set([...state.selected, key])]
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

      if (state.isNote) {
        addNote(state)(value)
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

  numPad.querySelectorAll("*").forEach((button) => {
    const btn = button as unknown as HTMLButtonElement
    btn.addEventListener("click", () => {
      const value = btn.dataset.value as unknown as Value
      if (!value) return
      if (state.isNote) addNote(state)(value)
      else addNew(state, value)
      renderCells(state)
    })
  })

  return state
}

export function keyEvents(state: State): State {
  const {nav} = state

  document.addEventListener("keydown", (e) => {
    if (e.key === "r") {
      document.location.reload()
    }
    if (state.gameState === "isInitialed") {
      if (e.key === "s") {
        state.gameState = "isPlaying"
        renderCells(state)
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
      } else addNew(state, `${value}`)
    }

    renderCells(state)
  })
  return state
}

export function panelEvents(state: State) {
  const {nav} = state

  const start = nav.querySelector("#start") as HTMLButtonElement
  if (!start) return state
  start.addEventListener("pointerdown", () => {
    if (state.gameState === "isInitialed") {
      state.gameState = "isPlaying"
      let btn = nav.querySelector("#start") as HTMLButtonElement
      btn.innerText = "Pause"
      renderCells(state)
    } else if (state.gameState === "isPaused") {
      state.gameState = "isPlaying"
      let btn = nav.querySelector("#start") as HTMLButtonElement
      btn.innerText = "Pause"
      renderCells(state)
    } else if (state.gameState === "isPlaying") {
      state.gameState = "isPaused"
      let btn = nav.querySelector("#start") as HTMLButtonElement

      btn.innerText = "Resume"
      renderCells(state)
    }
    renderCells(state)
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

    const found = state.selected
      .map((r) => state.notes.filter((h) => r.slice(0, 2) === h.slice(0, 2)))
      .flat() as unknown as Note[]

    state.notes = state.notes.filter((item) => !found.includes(item))
    renderCells(state)
  })

  const showHint = nav.querySelector("#hint") as HTMLButtonElement
  showHint.addEventListener("pointerdown", () => {
    if (state.gameState === "isPlaying") {
      const selected = state.selected
      selected.map((s) => {
        const value = state.solutions.get(s) as unknown as Value
        addNew(state, value)
      })
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

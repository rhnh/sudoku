import {addNote, renderBoard} from "./render"
import {State, Value} from "./types"
import {addNewValue} from "./utils"

export const createNumPad = (state: State): State => {
  const {bounds, numPad} = state
  numPad.innerHTML = ""

  for (const [k, i] of state.digits) {
    const el = document.createElement("button")
    el.classList.add("num")
    el.style.height = `${bounds().height / 9}px`
    el.dataset.value = `${i}`
    el.innerHTML = `${i}`
    el.dataset.key = `${k}`
    el.style.aspectRatio = `${1 / 1}`
    numPad.appendChild(el)
  }

  return state
}

export const numPadEvents = (state: State): State => {
  const {numPad} = state

  numPad.querySelectorAll("*").forEach((button) => {
    const btn = button as unknown as HTMLButtonElement
    btn.addEventListener("click", () => {
      const value: Value = btn.dataset.value as Value
      if (!value) return
      if (state.isNote) addNote(state)(value)
      else addNewValue(state, value)
      renderBoard(state)
    })
  })

  return state
}

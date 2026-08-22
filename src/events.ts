import {addNote} from "./notes"
import {renderBoard} from "./render"
import type {Key, Rank, State, Value, Position, MouchEvent} from "./types"

import {
  getPositionKeyAtDom,
  getKeyFromPosition,
  getElementByKey,
  getCommons,
  addNewValue,
} from "./utils"

export const events = (state: State): State => {
  const {board} = state
  board.addEventListener("pointerdown", pointerDown(state))

  board.addEventListener("pointerup", pointerup(state))

  board.addEventListener("pointermove", pointermove(state))

  return state
}

const getCoordinate = (e: MouseEvent | TouchEvent): Position => {
  if ("touches" in e) {
    const touch = e.touches[0]
    return [touch.clientX, touch.clientY]
  }

  return [e.clientX, e.clientY]
}
const getKey =
  (state: State) =>
  (e: MouchEvent): Key | undefined => {
    const [x, y] = getCoordinate(e)
    const position = getPositionKeyAtDom(state.bounds())([x, y])
    return getKeyFromPosition(position)
  }
const selectedEmptySquare = (state: State) => (e: MouchEvent, key: Key) => {
  //don't drag this square
  if (e.ctrlKey) {
    state.selected = [...new Set(state.selected), key]
  } else {
    state.selected = [...new Set([key])]
  }
  state.isHold = true
  renderBoard(state)
}

const selectedNonEmptySquare =
  (state: State) => (el: HTMLElement, key: Key) => {
    state.isDragging = true
    state.draggingElement = el
    state.selected = state.selected = [...new Set([key])]
    state.draggingElement.classList.add("selected")
    const value: Value = state.draggingElement.dataset.value as Value
    if (!value) return state
    state.draggingValue = value
    return state
  }

const pointerDown =
  (state: State) =>
  (e: MouchEvent): State => {
    const key = getKey(state)(e)

    if (!key) return state

    state.highlight = getCommons(state)(key)

    const el = getElementByKey(state)(key)
    if (!el) return state

    if (el.dataset.value === "0") selectedEmptySquare(state)(e, key)
    else selectedNonEmptySquare(state)(el, key)
    return state
  }

export const resetDraggingElement = (state: State) => {
  const p = state.draggingElement?.firstChild as unknown as HTMLElement
  if (state.draggingElement && p) {
    p.style.position = "unset"
    p.style.transform = "unset"
  }
  if (!state.draggingElement) {
    return
  }
  state.draggingElement.classList.remove("selected")
  state.board
    .querySelectorAll(".selected")
    .forEach((s) => s.classList.remove("selected"))
}

export const addNoteOrValue = (state: State) => {
  const value = state.draggingValue as unknown as Rank
  if (state.isNote) addNote(state)(value)
  else addNewValue(state, value)
}

export const stopDragging = (state: State) => {
  state.draggingElement = undefined
  state.isDragging = false
  state.draggingValue = undefined
}

export const fillNewSelectedCells = (state: State) => (key: Key) => {
  state.isHold = false
  state.targetKey = key
  state.selected = [...new Set([...state.selected, key])]
}

export const pointerup =
  (state: State) =>
  (e: MouchEvent): State => {
    const key = getKey(state)(e)

    if (!key) return state

    if (state.gameState !== "isPlaying") return state

    fillNewSelectedCells(state)(key)

    if (state.isDragging && state.draggingElement) {
      resetDraggingElement(state)
      addNoteOrValue(state)
    }
    stopDragging(state)
    renderBoard(state)
    return state
  }

const moveDraggingElement = (state: State) => (position: Position) => {
  const [x, y] = position
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

const pointermove = (state: State) => (e: MouchEvent) => {
  if (state.gameState !== "isPlaying") return

  const [x, y] = getCoordinate(e)

  const key = getKey(state)(e)

  if (state.isHold) {
    if (!key) return
    fillNewSelectedCells(state)(key)
    renderBoard(state)
  }
  if (state.isDragging) moveDraggingElement(state)([x, y])
}

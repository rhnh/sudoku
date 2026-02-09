import {numPadEvents} from "./events"
import {
  type CellElement,
  type Hint,
  type Key,
  type State,
  type Value,
} from "./types"
import {
  getPositionFromBound,
  keyToPosition,
  hValueToPosition,
  Box,
  memo,
  id,
} from "./utils"

export function renderBase(state: State): State {
  const container = document.getElementById("container")
  if (!container) {
    throw new Error('Not HtmlElement found with id "container"')
  }

  const bounds = memo(() => container.getBoundingClientRect())
  const board = document.createElement("board")
  container.appendChild(board)

  const numPad = document.createElement("numpad")
  container.appendChild(numPad)
  const panel = document.createElement("article")
  panel.classList.add("panel")
  panel.id = "panel"
  container.appendChild(panel)
  container.appendChild(panel)
  state = {...state, board, numPad, bounds, container, panel}

  return state
}
export function renderPanel(state: State) {
  const {panel, buttons} = state
  for (const [k, v] of buttons) {
    const btn = document.createElement("button")
    btn.innerText = `${v.replace(/([a-z])([A-Z])/g, "$1 $2")}`
    btn.classList.add(k)
    btn.classList.add("buttons")
    panel.append(btn)
  }
  return state
}

export function fill(state: State, value: Value) {
  console.log(value)
  if (state.isHint) {
    state.selected.map((s) => {
      const hint = `${s.slice(0, 2)}${value}` as unknown as Hint
      //check if already exist.
      const alreadyHint = state.hints.filter((h) => h === hint)
      if (alreadyHint.length > 0) {
        state.hints = state.hints.filter((i) => i !== hint)
        return state
      } else {
        console.log(hint)
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

export function renderCells(state: State): State {
  const {board, cells} = state
  board.innerHTML = ""

  for (const [k, v] of cells) {
    const cellElem = document.createElement("cell") as CellElement
    const p = keyToPosition(k as Key)
    const pos = getPositionFromBound(state, p)
    cellElem.style.transform = `translate(${pos[0]}px, ${pos[1]}px)`
    cellElem.style.position = "absolute"
    cellElem.style.height = `${state.bounds().height / 9}px`
    cellElem.style.width = `${state.bounds().width / 9}px`
    const selectedEl = state.selected.find((x) => k == x)
    cellElem.dataset.key = `${k}`
    cellElem.dataset.value = `${v}`
    if (selectedEl) {
      cellElem.classList.add("selected")
    }

    if (k.startsWith("c") || k.startsWith("f") || k.startsWith("i")) {
      cellElem.classList.add("horizontal-lines")
    }
    if (k.endsWith("444") || k.endsWith("777") || k.endsWith("111")) {
      cellElem.classList.add("vertical-lines")
    }
    if (k.startsWith("a")) {
      cellElem.classList.add("first-line")
    }
    if (k.endsWith("999")) {
      cellElem.classList.add("last-line")
    }
    const c = document.createElement("p")
    c.style.gridArea = "2 / 2 / 3 / 3"
    if (v !== "0") c.innerHTML = `${v}`
    cellElem.appendChild(c)
    board.appendChild(cellElem)
    renderHints(state, cellElem)
  }

  return state
}

export function renderHints(state: State, el: CellElement): State {
  const {hints} = state

  hints.map((h) => {
    const value = +h.slice(-1)
    const key = h.slice(0, 2) as unknown as Key
    if (!el.dataset.key?.startsWith(key) || el.dataset.value !== "0") return
    const [x, y] = hValueToPosition(value)
    const hint = document.createElement("hint") as CellElement
    hint.style.gridColumn = `${y} / 3`
    hint.style.gridRow = `${x} / 3`
    hint.innerHTML = `${value}`

    el?.appendChild(hint)
  })
  return state
}

export const render = (state: State): State => {
  if (state.forceRerender)
    requestAnimationFrame(() => {
      render(state)
    })
  return Box(state).map(renderCells).map(renderNumpad).fold(id)
}
export const createNumPad = (state: State): State => {
  const {bounds, numPad} = state
  numPad.innerHTML = ""
  numPad.style.height = `${bounds().height / 9}px`
  numPad.style.maxWidth = `${bounds().width}px`
  for (const [k, i] of state.digits) {
    const el = document.createElement("div")
    el.classList.add("num")
    el.dataset.value = `${i}`
    el.innerHTML = `${i}`
    el.dataset.key = `${k}`
    numPad.appendChild(el)
  }

  return state
}
export const renderNumpad = (state: State): State => {
  return Box(createNumPad(state)).map(numPadEvents).fold(id)
}

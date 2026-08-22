import {BTN_ICONS, TOTAL_FILE} from "./constants"
import {Box, id, memo} from "./lib"
import {renderNotes} from "./notes"
import {createNumPad, numPadEvents} from "./numpad"
import {panelEvents} from "./panelEvents"
import {State, CellElement} from "./state"
import {drawBackground} from "./svg"

import {type Key} from "./types"

import {
  getPositionFromBound,
  keyToPosition,
  formatTime,
  resizeObserver,
} from "./utils"

export const renderNumpad = (state: State): State =>
  Box(createNumPad(state)).map(numPadEvents).fold(id)

export const renderAside = (state: State) =>
  Box(state).map(renderNumpad).map(renderNavPanel).map(panelEvents).fold(id)

export const render = (state: State): State =>
  Box(state).map(renderBoard).map(renderAside).fold(id)

export function updateBounds(s: State): void {
  const bounds = s.wrap.getBoundingClientRect()
  const container = s.container
  let width =
    Math.floor(bounds.width * window.devicePixelRatio) /
      window.devicePixelRatio -
    bounds.width / 18

  container.style.width = width + "px"
  container.style.height = width + "px"
  // container.style.aspectRatio = "1 / 1"
  s.bounds.clear()
}

export function renderBase(state: State): State {
  const container = document.createElement("container")

  if (!container) {
    throw new Error('Not HtmlElement found with id "container"')
  }

  const board = document.createElement("board")

  container.appendChild(board)

  const numPad = document.createElement("numpad")
  numPad.id = "numpad"

  const header = document.createElement("head")
  header.id = "aside-head"
  const aside = document.createElement("section")
  aside.id = "aside"
  const nav = document.createElement("article")
  nav.classList.add("panel")
  nav.id = "panel"

  aside.appendChild(nav)
  aside.appendChild(numPad)

  state.wrap.append(container)
  state.wrap.appendChild(aside)
  const bounds = memo(() => container.getBoundingClientRect())

  state = {
    ...state,
    board,
    numpadSection: numPad,
    bounds,
    container,
    sidePanel: aside,
    ctrlBTNSection: nav,
  }
  resizeObserver(state)({render, updateBounds})
  return state
}
const renderBTNSection = (state: State): HTMLElement => {
  const {buttons, bounds} = state

  let btnsIndex = 0
  const btnSection = document.createElement("section")
  btnSection.classList.add("btn-section")
  for (const [k, v] of buttons) {
    const btn = document.createElement("button")
    btn.style.height = `${bounds().height / 9}px`
    btn.style.width = `${bounds().height / 9}px`
    // btn.style.width = `${bounds().width / 3 - 1}px`
    btn.id = `${v.replace(/\s/g, "-")}`.toLowerCase()
    btn.classList.add(k)

    btn.innerHTML = BTN_ICONS[btnsIndex++]
    btn.style.aspectRatio = `1`
    btn.classList.add("buttons")

    btnSection.append(btn)
  }
  return btnSection
}

const renderTimer = (state: State) => {
  const {bounds} = state
  const RATIO = 3
  const timer = document.createElement("section")
  timer.style.height = `${bounds().height / TOTAL_FILE}px`
  timer.style.width = `${bounds().height / RATIO}px`
  // timer.style.width = `${bounds().width / 3 - 1}px`
  timer.classList.add("timer-section")
  timer.id = "timer"

  const timerText = document.createElement("p")
  timer.appendChild(timerText)

  if (state.gameState === "isInitialed") {
    timerText.textContent = `00:00`
  }
  let seconds = state.seconds ? state.seconds : 0
  setInterval(() => {
    if (state.gameState === "isPlaying") {
      timerText.textContent = formatTime(state.seconds)
      state.seconds = seconds
      seconds++
    }
  }, 1000)
  return timer
}
export function renderNavPanel(state: State): State {
  const {ctrlBTNSection: nav} = state

  updateBounds(state)

  state.ctrlBTNSection.innerHTML = ""

  nav.appendChild(renderTimer(state))
  nav.appendChild(renderBTNSection(state))

  return state
}

export function renderGameOver(state: State) {
  const {board} = state
  // board.innerHTML = ""
  // board.style.position = "unset"
  // board.style.display = "flex"
  // board.style.justifyContent = "center"
  // board.style.alignItems = "center"
  const h1 = document.createElement("h1")
  h1.innerText = "Game Over"
  h1.style.width = `50%`

  h1.style.height = `50%`
  h1.style.transform = `translate(${state.bounds().width / 2 - 90}px,${state.bounds().height / 2 + 20}px)`
  h1.style.position = "absolute"

  board.appendChild(h1)
}

export function renderBoard(state: State): State {
  updateBounds(state)
  const {board} = state
  board.innerHTML = ""
  if (state.gameState === "isOvered") renderGameOver(state)
  renderCells(state)
  renderNotes(state)
  drawBackground(state)
  return state
}

function renderCells(state: State) {
  const {cells, board} = state
  for (const [k, v] of cells) {
    const cellElem = document.createElement("cell") as CellElement
    const p = keyToPosition(k as Key)
    const pos = getPositionFromBound(state, p)

    cellElem.style.transform = `translate(${pos[0]}px, ${pos[1]}px)`
    cellElem.style.position = "absolute"
    cellElem.style.height = `${state.bounds().height / 9}px`
    cellElem.style.width = `${state.bounds().width / 9}px`

    for (const [kh, _] of state.highlight) {
      if (kh === k) {
        cellElem.classList.add("highlighted")
      }
    }
    state.selected.map((selectedKey) => {
      if (selectedKey === k) {
        cellElem.classList.remove("highlighted")
        cellElem.classList.remove("duplicates")
        cellElem.classList.add("selected")
      }
    })
    if (state.duplicates.size > 1)
      for (const [kd, _] of state.duplicates) {
        if (k === kd) {
          cellElem.classList.remove("highlighted")
          cellElem.classList.remove("selected")
          cellElem.classList.add("duplicates")
        }
      }
    cellElem.dataset.key = `${k}`
    cellElem.dataset.value = `${v}`

    const c = document.createElement("p")
    c.style.gridArea = "2 / 2 / 3 / 3"

    if (v !== "0" && state.gameState !== "isInitialed") {
      c.innerHTML = `${v}`
    }
    if (state.gameState === "isPaused") {
      c.style.opacity = "0"
    }
    cellElem.appendChild(c)
    board.appendChild(cellElem)
    if (state.originCell.get(k) !== "0" && state.originCell.get(k)) {
      cellElem.classList.add("origin-cells")
    } else {
      cellElem.classList.remove("origin-cells")
      cellElem.classList.add("new-cells")
    }
    if (state.gameState === "isOvered" || state.gameState === "isPaused")
      cellElem.style.opacity = "0.3"
  }
}

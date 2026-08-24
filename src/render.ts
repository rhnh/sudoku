import {Box, id, memo} from "./lib"
import {renderNotes} from "./notes"
import {createNumPad, numPadEvents} from "./numpad"
import {panelEvents} from "./panelEvents"
import {createSideLayout, renderBTNSection, renderTimer} from "./renderPanel"
import {State, CellElement} from "./state"
import {drawBackground} from "./svg"

import {type Key} from "./types"

import {
  getPositionFromBound,
  keyToPosition,
  resizeObserver,
  updateBounds,
} from "./utils"

export const renderNumpad = (state: State): State =>
  Box(createNumPad(state)).map(numPadEvents).fold(id)

export const renderAside = (state: State) =>
  Box(state).map(renderNumpad).map(renderNavPanel).map(panelEvents).fold(id)

export const render = (state: State): State =>
  Box(state).map(renderBoard).map(renderAside).fold(id)

export function renderBase(state: State): State {
  const container = document.createElement("container")

  if (!container) {
    throw new Error('Not HtmlElement found with id "container"')
  }

  const board = document.createElement("board")

  container.appendChild(board)
  const {aside, nav, numPad} = createSideLayout()

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
    if (state.gameState === "isOvered" || state.gameState === "isPaused") {
      cellElem.style.opacity = "0.11"
    }

    cellElem.style.transform = `translate(${pos[0]}px, ${pos[1]}px)`
    cellElem.style.position = "absolute"
    cellElem.style.height = `${state.bounds().height / 9}px`
    cellElem.style.width = `${state.bounds().width / 9}px`

    cellElem.dataset.key = `${k}`
    cellElem.dataset.value = `${v}`
    showHighlighted(state)(cellElem, k)
    const c = document.createElement("p")
    c.style.gridArea = "2 / 2 / 3 / 3"

    if (v !== "0" && state.gameState !== "isInitialed") {
      c.innerHTML = `${v}`
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

const showHighlighted = (state: State) => (cellElem: CellElement, k: Key) => {
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
}

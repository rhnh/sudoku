import {Box, id, memo} from "./lib"
import {createNumPad, numPadEvents} from "./numpad"
import {panelEvents} from "./panelEvents"
import {renderBoard} from "./renderBoard"
import {createSideLayout, renderBTNSection, renderTimer} from "./renderPanel"
import type {State} from "./state"
import {resizeObserver, updateBounds} from "./utils"

export function renderNavPanel(state: State): State {
  const {ctrlBTNSection: nav} = state

  updateBounds(state)

  state.ctrlBTNSection.innerHTML = ""

  nav.appendChild(renderTimer(state))
  nav.appendChild(renderBTNSection(state))

  return state
}

export function renderBase(state: State): State {
  const container = document.createElement("container")

  const board = document.createElement("board")

  container.appendChild(board)
  const {aside, nav, numPad} = createSideLayout()
  state.wrap.dataset.theme = ""
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
  resizeObserver(state)({render: state.rerender, updateBounds})
  return state
}

export const render = (state: State): State =>
  Box(state).map(renderBoard).map(renderSidePanel).fold(id)

export const renderSidePanel = (state: State) =>
  Box(state).map(renderNumpad).map(renderNavPanel).map(panelEvents).fold(id)

export const renderNumpad = (state: State): State =>
  Box(createNumPad(state)).map(numPadEvents).fold(id)

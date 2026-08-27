import {BOARD_SIZE} from "./constants"
import {renderNotes} from "./notes"
import {renderGameOver} from "./renderGameOver"
import type {State, TypeCellElement} from "./state"
import {drawBackground} from "./svg"
import type {Key} from "./types"
import {
  getPositionFromBound,
  isInitialed,
  isOvered,
  isPaused,
  keyToPosition,
  updateBounds,
} from "./utils"

export function renderBoard(state: State): State {
  updateBounds(state)
  const {board} = state
  board.innerHTML = ""

  if (isOvered(state.gameState)) renderGameOver(state)
  renderCells(state)
  renderNotes(state)
  drawBackground(state)
  return state
}

function renderCells(state: State) {
  const {cells, board} = state
  for (const [k, v] of cells) {
    const cellElem = document.createElement("cell") as TypeCellElement
    const p = keyToPosition(k as Key)
    const pos = getPositionFromBound(state, p)
    if (isOvered(state.gameState) || isPaused(state.gameState)) {
      cellElem.style.opacity = "0.11"
    }

    cellElem.style.transform = `translate(${pos[0]}px, ${pos[1]}px)`
    cellElem.style.position = "absolute"
    cellElem.style.height = `${state.bounds().height / BOARD_SIZE}px`
    cellElem.style.width = `${state.bounds().width / BOARD_SIZE}px`

    cellElem.dataset.key = `${k}`
    cellElem.dataset.value = `${v}`
    showHighlighted(state)(cellElem, k)
    const c = document.createElement("p")
    c.style.gridArea = "2 / 2 / 3 / 3"

    if (v !== "0" && !isInitialed(state.gameState)) {
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
    if (isOvered(state.gameState) || isPaused(state.gameState))
      cellElem.style.opacity = "0.3"
  }
}

const showHighlighted =
  (state: State) => (cellElem: TypeCellElement, k: Key) => {
    // oxlint-disable-next-line no-unused-vars
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
      // oxlint-disable-next-line no-unused-vars
      for (const [kd, _] of state.duplicates) {
        if (k === kd) {
          cellElem.classList.remove("highlighted")
          cellElem.classList.remove("selected")
          cellElem.classList.add("duplicates")
        }
      }
  }

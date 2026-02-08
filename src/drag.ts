import {
  TOTAL_FILE,
  TOTAL_RANK,
  type CellElement,
  type Key,
  type State,
  type Value,
} from "./types"
import {getKeyFromPosition, getPositionKeyAtDom, keyToPosition} from "./utils"

export const dragBoard = (state: State): State => {
  const {board} = state

  board.addEventListener("mousedown", (e) => {
    state.isHold = true
  })

  return state
}
